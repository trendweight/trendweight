import { db } from "../firebase/admin";
import { MeasurementData, SourceData } from "./interfaces";

export const updateMeasurements = async (uid: string, data: MeasurementData) => {
  const promises = [];
  let vendor: keyof MeasurementData;
  promises.push(db.collection("measurements").doc(uid).set({ uid }));
  for (vendor in data) {
    promises.push(
      db
        .collection("measurements")
        .doc(uid)
        .collection("sources")
        .doc(vendor)
        .set({ ...data[vendor] })
    );
  }
  await Promise.all(promises);
};

export const getMeasurementsForSource = async (uid: string, source: keyof MeasurementData) => {
  const data = await db.collection("measurements").doc(uid).collection("sources").doc(source).get();
  if (data.exists) {
    return data.data() as SourceData;
  }
};

export const getMeasurements = async (uid: string) => {
  const sources = await db.collection("measurements").doc(uid).collection("sources").get();
  const data: MeasurementData = {};
  if (!sources.empty) {
    sources.docs.forEach((doc) => {
      data[doc.id as keyof MeasurementData] = doc.data() as SourceData;
    });
  }
};
