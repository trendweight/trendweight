import firebase from "./firebase";

const firestore = firebase.firestore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = (uid: string, data: any) => {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
};
