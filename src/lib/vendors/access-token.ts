import { Instant } from "@js-joda/core";
import { AccessToken } from "~/lib/interfaces";

export const fromTokenValues = (values: AccessToken & { expires_in?: number }) => {
  const { expires_in, ...tokenValues } = values;
  return {
    ...tokenValues,
    expires_at: expires_in ? Instant.now().plusSeconds(expires_in).toString() : undefined,
  };
};

export const expiresSoon = (token: AccessToken) => {
  if (!token.expires_at) {
    return false;
  }
  const expiresAt = Instant.parse(token.expires_at);
  const cutoff = Instant.now().minusSeconds(300); // 5 minutes before now
  if (cutoff.isAfter(expiresAt)) {
    return true;
  } else {
    return false;
  }
};
