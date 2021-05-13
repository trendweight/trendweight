import { Instant } from "@js-joda/core";
import equal from "fast-deep-equal";
import { RawMeasurement, SourceData, VendorLink } from "../data/interfaces";
import { getLinks, updateLinkToken } from "../data/links";
import { getSourceData, updateSourceData } from "../data/source-data";
import { expiresSoon } from "./access-token";
import { withingsService } from "./withings";

export const refreshAndGetSourceData = async (uid: string) => {
  const links = await getLinks(uid);

  if (links) {
    const existingData = await getSourceData(uid);
    const dataToBeReturned: SourceData[] = [];
    const dataToBeUpdated: SourceData[] = [];
    const { withings } = links;
    const recently = Instant.now().minusSeconds(300);

    if (withings) {
      const existingWithingsData = existingData?.find((d) => d.source === "withings");

      if (
        existingWithingsData &&
        existingWithingsData.lastUpdate &&
        Instant.parse(existingWithingsData?.lastUpdate).isAfter(recently)
      ) {
        dataToBeReturned.push(existingWithingsData);
      } else {
        if (expiresSoon(withings.token)) {
          withings.token = await withingsService.refreshToken(withings.token);
          await updateLinkToken(uid, "refresh", withings.token);
        }

        const updatedWithingsData = await refreshWithings(uid, withings, existingWithingsData);
        dataToBeReturned.push(updatedWithingsData);
        dataToBeUpdated.push({
          source: "withings",
          lastUpdate: updatedWithingsData.lastUpdate,
          measurements:
            updatedWithingsData.measurements !== existingWithingsData?.measurements
              ? updatedWithingsData.measurements
              : undefined,
        });
      }
    }

    await updateSourceData(uid, dataToBeUpdated);
    return dataToBeReturned;
  }
};

const refreshWithings = async (uid: string, link: VendorLink, existingData?: SourceData): Promise<SourceData> => {
  let start: number;
  if (existingData && existingData.lastUpdate) {
    const lastUpdate = Instant.parse(existingData.lastUpdate);
    start = lastUpdate.minusSeconds(90 * 3600 * 24).epochSecond();
  } else {
    start = 1;
  }

  const updateTimestamp = Instant.now();
  let more = true;
  let offset: unknown;
  const newMeasurements: RawMeasurement[] = [];
  while (more) {
    const newData = await withingsService.getMeasurements(link.token, start, offset);
    more = newData.more;
    offset = newData.offset;
    newMeasurements.push(...newData.measurements);
  }
  newMeasurements.sort((a, b) => b.timestamp - a.timestamp); // sort in descending order by timestamp

  if (existingData) {
    const existingMeasurementsToReplace = existingData?.measurements?.filter((m) => m.timestamp >= start) || [];
    existingMeasurementsToReplace.sort((a, b) => b.timestamp - a.timestamp);
    if (equal(existingMeasurementsToReplace, newMeasurements)) {
      // data didn't change, return the old data
      return {
        source: "withings",
        lastUpdate: updateTimestamp.toString(),
        measurements: existingData.measurements,
      };
    }
  }

  const existingMeasurementsToKeep = existingData?.measurements?.filter((m) => m.timestamp < start) || [];
  const combinedMeasurements = ([] as RawMeasurement[]).concat(newMeasurements, existingMeasurementsToKeep);
  combinedMeasurements.sort((a, b) => b.timestamp - a.timestamp);

  return {
    source: "withings",
    lastUpdate: updateTimestamp.toString(),
    measurements: combinedMeasurements,
  };
};
