import { db } from "./firebase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrUpdateUser = async (uid: string, data: any) => {
  console.log("createOrUpdateUser", data);
  return await db
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
};

export const getUserData = async (uid: string) => {
  return db.collection("users").doc(uid).get();
};
