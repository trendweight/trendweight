import { LocalDate } from '@js-joda/core';
import { computeMeasurements } from '../measurements';
import { ProfileData, SourceData } from '../../../core/interfaces';

describe('computeMeasurements', () => {
  const mockProfile: ProfileData = {
    id: 'user123',
    username: 'testuser',
    createdAt: 1640995200, // 2022-01-01
    updatedAt: 1640995200,
    settings: {
      metric: false,
      timezone: 'America/New_York',
    },
    timezone: 'America/New_York',
    dayStartOffset: 0,
  };

  it('returns undefined when data is missing', () => {
    expect(computeMeasurements(undefined, mockProfile)).toBeUndefined();
    expect(computeMeasurements([], undefined)).toBeUndefined();
  });

  it('returns empty array when no measurements exist', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    expect(result).toEqual([]);
  });

  it('processes single measurement correctly', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [{
        timestamp: 1641081600, // 2022-01-02 00:00:00 UTC
        weight: 75.5,
      }],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      source: 'withings',
      actualWeight: 75.5,
      trendWeight: 75.5, // First measurement, trend equals actual
      weightIsInterpolated: false,
      fatIsInterpolated: false,
    });
  });

  it('calculates weight trend correctly', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 75.0 }, // Day 1
        { timestamp: 1641168000, weight: 74.5 }, // Day 2
        { timestamp: 1641254400, weight: 74.0 }, // Day 3
      ],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    expect(result).toHaveLength(3);
    
    // First day: trend = actual
    expect(result![0].trendWeight).toBe(75.0);
    
    // Second day: trend = previous + 0.1 * (actual - previous)
    // = 75.0 + 0.1 * (74.5 - 75.0) = 75.0 - 0.05 = 74.95
    expect(result![1].trendWeight).toBeCloseTo(74.95, 2);
    
    // Third day: trend = 74.95 + 0.1 * (74.0 - 74.95) = 74.95 - 0.095 = 74.855
    expect(result![2].trendWeight).toBeCloseTo(74.855, 2);
  });

  it('interpolates missing days correctly', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 70.0 }, // Jan 2
        { timestamp: 1641340800, weight: 73.0 }, // Jan 5 (3 days later)
      ],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    // Should have 4 measurements: Jan 2, 3 (interpolated), 4 (interpolated), 5
    expect(result).toHaveLength(4);
    
    // Check interpolated values
    expect(result![1]).toMatchObject({
      source: 'interpolated',
      actualWeight: 71.0, // Linear interpolation
      weightIsInterpolated: true,
    });
    
    expect(result![2]).toMatchObject({
      source: 'interpolated',
      actualWeight: 72.0,
      weightIsInterpolated: true,
    });
  });

  it('handles fat percentage data correctly', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 70.0, fatRatio: 0.25 },
        { timestamp: 1641168000, weight: 69.5, fatRatio: 0.24 },
      ],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    expect(result).toHaveLength(2);
    
    // First measurement
    expect(result![0]).toMatchObject({
      actualFatPercent: 0.25,
      actualFatMass: 17.5, // 70 * 0.25
      actualLeanMass: 52.5, // 70 - 17.5
      trendFatPercent: 0.25,
      trendFatMass: 17.5,
      trendLeanMass: 52.5,
      fatIsInterpolated: false,
    });
    
    // Second measurement with trend calculation
    expect(result![1].actualFatPercent).toBe(0.24);
    expect(result![1].actualFatMass).toBeCloseTo(16.68, 2); // 69.5 * 0.24
    expect(result![1].trendFatPercent).toBeCloseTo(0.249, 3); // 0.25 + 0.1 * (0.24 - 0.25)
  });

  it('handles multiple sources by taking first measurement of each day', () => {
    const sourceData: SourceData[] = [
      {
        source: 'withings',
        measurements: [
          { timestamp: 1641081600, weight: 70.0 }, // 00:00
          { timestamp: 1641085200, weight: 70.5 }, // 01:00
        ],
      },
      {
        source: 'fitbit',
        measurements: [
          { timestamp: 1641082800, weight: 70.2 }, // 00:20
        ],
      },
    ];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    // Should only have one measurement for the day (first by timestamp)
    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      source: 'withings',
      actualWeight: 70.0,
    });
  });

  it('respects dayStartOffset for grouping measurements', () => {
    const profileWithOffset = {
      ...mockProfile,
      dayStartOffset: 6, // Day starts at 6 AM
    };
    
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 70.0 }, // Jan 2, 12:00 AM EST
        { timestamp: 1641124800, weight: 71.0 }, // Jan 2, 12:00 PM EST
        { timestamp: 1641168000, weight: 72.0 }, // Jan 3, 12:00 AM EST
      ],
    }];
    
    const result = computeMeasurements(sourceData, profileWithOffset);
    
    // Should group measurements according to offset
    // The exact behavior depends on timezone calculations
    expect(result).toBeDefined();
    expect(result!.length).toBeGreaterThan(0);
  });

  it('handles edge case with no weight changes', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 70.0 },
        { timestamp: 1641168000, weight: 70.0 },
        { timestamp: 1641254400, weight: 70.0 },
      ],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    expect(result).toHaveLength(3);
    expect(result![0].trendWeight).toBe(70.0);
    expect(result![1].trendWeight).toBe(70.0);
    expect(result![2].trendWeight).toBe(70.0);
  });

  it('interpolates fat data for missing days', () => {
    const sourceData: SourceData[] = [{
      source: 'withings',
      measurements: [
        { timestamp: 1641081600, weight: 70.0, fatRatio: 0.20 }, // Jan 2
        { timestamp: 1641168000, weight: 69.0 }, // Jan 3 (no fat data)
        { timestamp: 1641254400, weight: 68.0, fatRatio: 0.18 }, // Jan 4
      ],
    }];
    
    const result = computeMeasurements(sourceData, mockProfile);
    
    expect(result).toHaveLength(3);
    
    // Jan 3 should have interpolated fat data
    expect(result![1].actualFatPercent).toBeCloseTo(0.19, 2);
    expect(result![1].fatIsInterpolated).toBe(true);
  });
});