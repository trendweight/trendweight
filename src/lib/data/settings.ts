import { db } from "../firebase/admin";
import { Profile, Settings } from "../interfaces";

export const getSettingsByUserId = async (uid: string) => {
  const settings = await db.collection("users").doc(uid).get();
  if (settings.exists) {
    return settings.data() as Settings;
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
