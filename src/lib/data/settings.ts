import { LocalDate } from "@js-joda/core";
import { db } from "../firebase/admin";
import { Profile, Settings } from "../interfaces";

type StoredSettings = Omit<Settings, "goalStart"> & { goalStart?: string };

export const getSettingsByUserId = async (uid: string) => {
  const storedSettings = await db.collection("users").doc(uid).get();
  if (storedSettings.exists) {
    const { goalStart, ...rest } = storedSettings.data() as StoredSettings;
    const settings: Settings = {
      ...rest,
      goalStart: goalStart ? LocalDate.parse(goalStart) : undefined,
    };
    return settings;
  }
};

export const getProfileByUserId = async (uid: string) => {
  const settings = await getSettingsByUserId(uid);
  if (!settings) {
    return undefined;
  }
  const { uid: _uid, email: _email, ...profile } = settings;
  return profile as Profile;
};
