import { ProfileData, SettingsData } from "../core/interfaces";
import { db } from "./firebase/admin";

export const getSettingsByUserId = async (uid: string) => {
  const settings = await db.collection("users").doc(uid).get();
  if (settings.exists) {
    return settings.data() as SettingsData;
  }
};

export const getProfileByUserId = async (uid: string) => {
  const settings = await getSettingsByUserId(uid);
  if (!settings) {
    return undefined;
  }
  const { uid: _uid, email: _email, ...profile } = settings;
  return profile as ProfileData;
};
