import { formatWeight, formatPercent, formatNumber, formatMeasurement } from "../numbers";

describe("numbers utilities", () => {
  describe("formatWeight", () => {
    it("formats weight in metric without sign", () => {
      expect(formatWeight(75.5, true, false)).toBe("75.5 kg");
      expect(formatWeight(80, true, false)).toBe("80.0 kg");
    });

    it("formats weight in metric with sign", () => {
      expect(formatWeight(2.5, true, true)).toBe("+2.5 kg");
      expect(formatWeight(-1.2, true, true)).toBe("-1.2 kg");
    });

    it("formats weight in imperial without sign", () => {
      expect(formatWeight(165.5, false, false)).toBe("165.5 lb");
      expect(formatWeight(180, false, false)).toBe("180.0 lb");
    });

    it("formats weight in imperial with sign", () => {
      expect(formatWeight(5.5, false, true)).toBe("+5.5 lb");
      expect(formatWeight(-3.2, false, true)).toBe("-3.2 lb");
    });
  });

  describe("formatPercent", () => {
    it("formats percentage without sign", () => {
      expect(formatPercent(0.255)).toBe("25.5%");
      expect(formatPercent(0.15)).toBe("15.0%");
    });

    it("formats percentage with sign", () => {
      expect(formatPercent(0.05, true)).toBe("+5.0%");
      expect(formatPercent(-0.03, true)).toBe("-3.0%");
    });
  });

  describe("formatNumber", () => {
    it("formats number without sign", () => {
      expect(formatNumber(123.45)).toBe("123.5");
      expect(formatNumber(100)).toBe("100.0");
    });

    it("formats number with sign", () => {
      expect(formatNumber(50.5, true)).toBe("+50.5");
      expect(formatNumber(-25.3, true)).toBe("-25.3");
    });
  });

  describe("formatMeasurement", () => {
    it("formats fat percentage with units", () => {
      expect(formatMeasurement(0.225, { type: "fatpercent", units: true })).toBe("22.5%");
      expect(formatMeasurement(0.225, { type: "fatpercent", units: true, sign: true })).toBe("+22.5%");
    });

    it("formats fat percentage without units", () => {
      expect(formatMeasurement(0.225, { type: "fatpercent", units: false })).toBe("22.5");
      expect(formatMeasurement(0.225, { type: "fatpercent", units: false, sign: true })).toBe("+22.5");
    });

    it("formats weight measurements with units", () => {
      expect(formatMeasurement(75, { type: "weight", units: true, metric: true })).toBe("75.0 kg");
      expect(formatMeasurement(165, { type: "weight", units: true, metric: false })).toBe("165.0 lb");
    });

    it("formats weight measurements without units", () => {
      expect(formatMeasurement(75, { type: "weight", units: false })).toBe("75.0");
      expect(formatMeasurement(-2.5, { type: "weight", units: false, sign: true })).toBe("-2.5");
    });
  });
});
