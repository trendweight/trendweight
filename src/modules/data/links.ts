import { Instant } from "@js-joda/core";
import { AccessToken, Links } from "../shared/interfaces";
import { db } from "./firebase/admin";

export const updateLinkToken = async (uid: string, reason: string, token: AccessToken) => {
  await db
    .collection("links")
    .doc(uid)
    .set(
      {
        uid: uid,
        withings: {
          updateTime: Instant.now().toString(),
          updateReason: reason,
          token: token,
        },
      },
      { merge: true }
    );
};

export const getLinks = async (uid: string) => {
  const links = await db.collection("links").doc(uid).get();
  if (links.exists) {
    return links.data() as Links;
  }
};
