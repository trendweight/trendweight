import { db } from "../firebase/admin";
import { RawMeasurement, SourceData, Sources } from "./interfaces";

interface Metadata {
  uid: string;
  lastUpdates: Record<Sources, string>;
}

export const updateSourceData = async (uid: string, data: SourceData[]) => {
  const promises = [];
  const updatedPaths = ["uid"].concat(data.map((value) => `lastUpdates.${value.source}`));
  const lastUpdates = data.reduce((t, s) => {
    t[s.source] = s.lastUpdate;
    return t;
  }, {} as Record<Sources, string>);
  promises.push(db.collection("measurements").doc(uid).set({ uid, lastUpdates }, { mergeFields: updatedPaths }));
  for (const entry of data) {
    if (entry.measurements) {
      promises.push(
        db
          .collection("measurements")
          .doc(uid)
          .collection("sources")
          .doc(entry.source)
          .set({ measurements: entry.measurements })
      );
    }
  }
  await Promise.all(promises);
};

export const getSourceData = async (uid: string) => {
  const metadataDoc = await db.collection("measurements").doc(uid).get();
  const sources = await db.collection("measurements").doc(uid).collection("sources").get();
  if (!metadataDoc.exists || sources.empty) {
    return undefined;
  }
  const metadata = metadataDoc.data() as Metadata;
  const sourceData: SourceData[] = sources.docs.map((doc) => ({
    source: doc.id as Sources,
    lastUpdate: metadata.lastUpdates[doc.id as Sources],
    measurements: doc.data().measurements as RawMeasurement[],
  }));
  return sourceData;
};
