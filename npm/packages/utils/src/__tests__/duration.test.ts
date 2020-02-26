import { duration, Resources } from "../duration";

const resources: Resources = {
  dateHrs: "dateHrs",
  dateMin: "dateMin",
  dateHour: "dateHour",
  dateHours: "dateHours"
};

describe("Duration", () => {
  it("Hour and minutes duration displays correctly", () => {
    const durationText = duration("PT3H2M1S", resources);
    expect(durationText).toEqual("3 dateHrs 2 dateMin");
  });

  it("Minutes duration displays correctly", () => {
    const durationText = duration("P30M", resources);
    expect(durationText).toEqual("30 dateMin");
  });

  it("Single hour in minuttes duration displays correctly", () => {
    const durationText = duration("P60M", resources);
    expect(durationText).toEqual("1 dateHour");
  });

  it("Too long minutes duration displays correctly", () => {
    const durationText = duration("P90M", resources);
    expect(durationText).toEqual("1 dateHrs 30 dateMin");
  });

  it("Multiple hours duration displays correctly", () => {
    const durationText = duration("P2H", resources);
    expect(durationText).toEqual("2 dateHours");
  });

  it("Single hour duration displays correctly", () => {
    const durationText = duration("P1H", resources);
    expect(durationText).toEqual("1 dateHour");
  });

  it("Single hour duration with minuttes displays correctly", () => {
    const durationText = duration("P1H30M", resources);
    expect(durationText).toEqual("1 dateHrs 30 dateMin");
  });

  it("Single minute duration displays correctly", () => {
    const durationText = duration("P1M", resources);
    expect(durationText).toEqual("1 dateMin");
  });
});
