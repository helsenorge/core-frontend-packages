import { timeRangeBetween, initialize } from "../moment-utils";

describe("moment-utils", () => {
  describe("timeRangeBetween", () => {
    it("is generated correctly", () => {
      initialize();
      const start = "2017-09-01T07:00:00";
      const end = "2017-09-01T10:00:00";
      const string = timeRangeBetween(start, end);
      expect(string).toEqual("1. sep. 2017, mellom kl. 07:00 og 10:00");
    });
  });
});
