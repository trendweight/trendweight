import { Instant } from "@js-joda/core";
import _ from "lodash";
import { MeasurementData, SourceMeasurement, VendorLink } from "../data/interfaces";
import { getLinks, updateLinkToken } from "../data/links";
import { getMeasurementsForSource, updateMeasurements } from "../data/measurements";
import { expiresSoon } from "./access-token";
import { withingsService } from "./withings";

export const refreshMeasurementData = async (uid: string) => {
  const links = await getLinks(uid);

  if (links) {
    const updates: MeasurementData = {};
    const { withings } = links;

    if (withings) {
      if (expiresSoon(withings.token)) {
        withings.token = await withingsService.refreshToken(withings.token);
        await updateLinkToken(uid, "refresh", withings.token);
      }

      const withingsUpdate = await refreshWithings(uid, withings);
      updates.withings = withingsUpdate;
    }

    await updateMeasurements(uid, updates);
    return updates;
  }
};

const refreshWithings = async (uid: string, withings: VendorLink) => {
  let start: number;
  const existingData = await getMeasurementsForSource(uid, "withings");
  if (existingData) {
    const lastUpdate = Instant.parse(existingData.lastUpdate);
    start = lastUpdate.minusSeconds(90 * 3600 * 24).epochSecond();
  } else {
    start = 1;
  }

  const updateTimestamp = Instant.now();
  let more = true;
  let offset: unknown;
  const newMeasurements: SourceMeasurement[][] = [];
  while (more) {
    const newData = await withingsService.getMeasurements(withings.token, start, offset);
    more = newData.more;
    offset = newData.offset;
    newMeasurements.push(newData.measurements);
  }

  const existingMeasurements = existingData?.measurements.filter((m) => m.timestamp < start) || [];
  const combinedMeasurements = _.orderBy(existingMeasurements.concat(...newMeasurements), "timestamp", "desc");

  return {
    lastUpdate: updateTimestamp.toString(),
    measurements: combinedMeasurements,
  };
};
