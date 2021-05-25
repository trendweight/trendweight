import axios from "axios";
import { NextApiRequest } from "next";
import qs from "qs";
import { ApiError } from "~/lib/api/exceptions";
import { AccessToken, RawMeasurement } from "~/lib/interfaces";
import { fromTokenValues } from "./access-token";
import { VendorService } from "./interfaces";

export const getCallbackHostname = (req: NextApiRequest) => {
  let hostname = req.headers.host || "trendweight.io";

  // Withings doesn't allow use of localhost for the callback, so we use dev.trendweight.io
  // which doesn't exist.  That way when Withings redirect, the browser shows an error page and
  // we can edit the URL in the browser to replace dev.trendweight.io with localhost:3000.
  if (hostname.startsWith("localhost")) {
    hostname = "dev.trendweight.io";
  }
  return hostname;
};

interface WithingsResponse {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  error?: string;
}

interface WithingsMeasure {
  value: number;
  type: number;
  unit: number;
}

interface WithingsMeasureGroup {
  grpid: number;
  attrib: number;
  date: number;
  created: number;
  category: number;
  deviceid: string;
  measures: WithingsMeasure[];
}
interface WithingsGetMeasuresResponse {
  updatetime: string;
  timezone: string;
  measuregrps: WithingsMeasureGroup[];
  more: number;
  offset: number;
}

class WithingsService implements VendorService {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  getAuthorizationUrl(state: string, callbackUrl: string) {
    const url = new URL("https://account.withings.com/oauth2_user/authorize2");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "user.metrics");
    url.searchParams.append("state", state);
    url.searchParams.append("redirect_uri", callbackUrl);
    return url.href;
  }

  async exchangeAuthorizationCode(code: string, callbackUrl: string) {
    const params = {
      action: "requesttoken",
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      redirect_uri: callbackUrl,
    };

    const result = await axios.post<WithingsResponse>("https://wbsapi.withings.net/v2/oauth2", qs.stringify(params));

    if (result.status !== 200) {
      throw new ApiError("withings/http-error", `${result.status}: ${result.statusText}`);
    }

    if (result.data.status !== 0) {
      throw new ApiError("withings/api-error", `${result.data.status}: ${result.data.error}`);
    }

    return fromTokenValues(result.data.body);
  }

  async refreshToken(token: AccessToken) {
    const params = {
      action: "requesttoken",
      grant_type: "refresh_token",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: token.refresh_token,
    };

    const result = await axios.post<WithingsResponse>("https://wbsapi.withings.net/v2/oauth2", qs.stringify(params));

    if (result.status !== 200) {
      throw new ApiError("withings/http-error", `${result.status}: ${result.statusText}`);
    }

    if (result.data.status !== 0) {
      throw new ApiError("withings/api-error", `${result.data.status}: ${result.data.error}`);
    }

    return fromTokenValues(result.data.body);
  }

  async getMeasurements(token: AccessToken, start: unknown, offset?: unknown) {
    // const startTimestamp = start.atStartOfDay().atZone(ZoneId.UTC).toInstant().epochSecond();
    // const endTimestamp = end.plusDays(1).atStartOfDay().minusSeconds(1).atZone(ZoneId.UTC).toInstant().epochSecond();

    const params = {
      action: "getmeas",
      category: 1,
      startdate: start,
      offset: offset || undefined,
    };

    const response = await axios.post<WithingsResponse>("https://wbsapi.withings.net/measure", qs.stringify(params), {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    if (response.status !== 200) {
      throw new ApiError("withings/http-error", `${response.status}: ${response.statusText}`);
    }

    if (response.data.status !== 0) {
      throw new ApiError("withings/api-error", `${response.data.status}: ${response.data.error}`);
    }

    const body = response.data.body as WithingsGetMeasuresResponse;
    const timezone = body.timezone;

    const measureToDecimal = (measure?: WithingsMeasure) =>
      measure ? measure.value * Math.pow(10, measure.unit) : undefined;

    const measurements: RawMeasurement[] = [];
    for (const group of body.measuregrps) {
      const timestamp = group.date;
      const weight = measureToDecimal(group.measures.find((m) => m.type === 1));
      const fatPercent = measureToDecimal(group.measures.find((m) => m.type === 6));
      if (weight) {
        const measurement: RawMeasurement = {
          timestamp,
          weight,
        };
        if (fatPercent) {
          measurement.fatRatio = fatPercent / 100;
        }
        measurements.push(measurement);
      }
    }

    return { measurements, more: body.more > 0, offset: body.offset || null, timezone };
  }
}

export const withingsService = new WithingsService(
  process.env.WITHINGS_CLIENT_ID || "",
  process.env.WITHINGS_CLIENT_SECRET || ""
) as VendorService;
