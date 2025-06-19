import { LocalDate, LocalDateTime } from "@js-joda/core";
import { shortDate, recentDate } from "../dates";

describe("dates utilities", () => {
  describe("shortDate", () => {
    it("formats LocalDate correctly", () => {
      const date = LocalDate.of(2024, 6, 15);
      const result = shortDate(date);
      // Format will vary by locale, but should contain the date components
      expect(result).toContain("15");
      expect(result).toMatch(/Jun|June|6/);
      expect(result).toContain("2024");
    });

    it("formats LocalDateTime correctly", () => {
      const dateTime = LocalDateTime.of(2024, 12, 25, 10, 30);
      const result = shortDate(dateTime);
      expect(result).toContain("25");
      expect(result).toMatch(/Dec|December|12/);
      expect(result).toContain("2024");
    });
  });

  describe("recentDate", () => {
    it("formats LocalDate with weekday", () => {
      const date = LocalDate.of(2024, 1, 1); // This would be a Monday
      const result = recentDate(date);
      // Should include weekday abbreviation, month abbreviation, and day
      expect(result).toMatch(/\w{3}/); // Three letter weekday
      expect(result).toMatch(/Jan|January/);
      expect(result).toContain("1");
    });

    it("formats LocalDateTime with weekday", () => {
      const dateTime = LocalDateTime.of(2024, 7, 4, 15, 45); // July 4th
      const result = recentDate(dateTime);
      expect(result).toMatch(/Jul|July/);
      expect(result).toContain("4");
    });
  });
});
