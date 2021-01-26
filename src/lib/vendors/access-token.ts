import dayjs from "../core/dayjs";

export interface IToken {
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  expires_at?: string;
}

export class AccessToken {
  token: IToken;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(values: IToken & { expires_in?: number }) {
    const { expires_in, ...token } = values;
    if (expires_in) {
      token.expires_at = dayjs().add(expires_in, "seconds").utc().toISOString();
    }
    this.token = token;
  }

  expiresSoon = () => {
    if (!this.token.expires_at) {
      return false;
    }
    const cutoff = dayjs().utc().subtract(5, "minutes");
    if (dayjs(this.token.expires_at).isAfter(cutoff)) {
      return true;
    } else {
      return false;
    }
  };
}
