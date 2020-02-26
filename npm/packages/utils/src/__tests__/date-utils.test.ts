import {
  toServerDate,
  toLocalISOString,
  isDaylightSavingTime,
  addDifference,
  isDotNetMinDate
} from "../date-utils";

describe("date-utils", () => {
  describe(".NET Compatible ISO String", () => {
    it("is generated correctly", () => {
      const iso = "2017-02-01T00:01:01";
      const date = toServerDate(iso);
      const compatibleDate = toLocalISOString(date);
      expect(compatibleDate).toEqual(iso);
    });
  });
  describe("isDaylightSavingTime", () => {
    it("is determined correctly", () => {
      const winter = new Date(2017, 2, 25);
      expect(isDaylightSavingTime(winter)).toBe(false);
      const summer = new Date(2017, 7, 15);
      expect(isDaylightSavingTime(summer)).toBe(true);
    });
  });
  describe("addDifference", () => {
    it("is generated correctly", () => {
      const start = "2017-11-01T12:00:00";
      const end = "2017-11-01T15:00:00";
      const originalStart = "2017-09-01T07:00:00";
      const originalEnd = "2017-09-01T10:00:00";
      const generatedEnd = addDifference(start, originalStart, originalEnd);
      expect(generatedEnd).toEqual(end);
    });
  });
  describe("isDotNetMinDate", () => {
    it("is determined correctly", () => {
      const date = "0001-01-01T00:00:00";
      expect(isDotNetMinDate(date)).toBe(true);
    });
  });
});
