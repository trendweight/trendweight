import dayjs, { Dayjs } from "dayjs";

export class AccessToken {
  user_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  expires_at?: Dayjs;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(token: any) {
    const { expires_in, ...props } = token;
    Object.assign(this, props);
    if (expires_in && !this.expires_at) {
      this.expires_at = dayjs().add(expires_in, "seconds");
    }
  }

  expiresSoon = () => {
    if (!this.expires_at) {
      return false;
    }
    const cutoff = dayjs().subtract(5, "minutes");
    if (this.expires_at.isAfter(cutoff)) {
      return true;
    } else {
      return false;
    }
  };
}
