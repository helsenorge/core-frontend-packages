import * as icalUtils from '../ical-utils';

describe('Debug', () => {
  describe('Gitt at formatDuration kalles', () => {
    describe('Når timer og minutter er sendt', () => {
      it('Så returneres det en ical duration', () => {
        const duration = icalUtils.formatDuration(1, 15);
        expect(duration).toEqual('P1H15M');
      });
    });
  });

  describe('Gitt at toDuration kalles', () => {
    describe('Når timer og minutter er sendt', () => {
      it('Så returneres det en rounded ical duration', () => {
        const duration = icalUtils.toDuration(1, 15);
        expect(duration).toEqual('P1H15M');
      });
    });
  });

  describe('Gitt at arrangeDuration kalles', () => {
    describe('Når en duration objekt er sendt', () => {
      it('Så returneres en duration objekt med tilpasset verdier', () => {
        const d = {
          weeks: 0,
          days: 2,
          hours: 14,
          minutes: 74,
          seconds: 84,
          isNegative: false,
        };
        const durationObject = icalUtils.arrangeDuration(d as durationUtils.Duration);
        expect(durationObject.weeks).toEqual(0);
        expect(durationObject.days).toEqual(2);
        expect(durationObject.hours).toEqual(15);
        expect(durationObject.minutes).toEqual(14);
        expect(durationObject.seconds).toEqual(84);
        expect(durationObject.weeks).toBeFalsy();
      });
    });
  });

  describe('Gitt at duration kalles', () => {
    describe('Når en duration og en obj med strenger er sendt', () => {
      it('Så konkateneres det i en korrekt string', () => {
        const r = {
          dateHrs: 'hrs',
          dateMin: 'min',
          dateHour: 'hr',
          dateHours: 'hours',
        };
        const durationObject = icalUtils.duration('P1H15M', r);
        expect(durationObject).toEqual('1 hrs 15 min');
      });
    });
  });

  describe('Gitt at combineDurations kalles', () => {
    describe('Når to ical durations er sendt', () => {
      it('Så returneres det summen av de to', () => {
        const a = 'PT1H0M0S';
        const b = 'PT15M';
        const duration = icalUtils.combineDurations(a, b);
        expect(duration).toEqual('P1H15M');
      });
    });
  });
});
