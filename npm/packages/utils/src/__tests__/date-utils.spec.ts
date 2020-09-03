import { todaysDate, toDate, getMonthName } from '../date-utils';

interface ResourcesWithMonthNames {
  monthNameApril: string;
  monthNameAugust: string;
  monthNameDecember: string;
  monthNameFebruary: string;
  monthNameJanuary: string;
  monthNameJuly: string;
  monthNameJune: string;
  monthNameMarch: string;
  monthNameMay: string;
  monthNameNovember: string;
  monthNameOctober: string;
  monthNameSeptember: string;
}

describe('Date-utils', () => {
  describe('Gitt at en ny dato lages, når todayDate blir kalt', () => {
    let realDate;
    realDate = Date;
    const currentDate = new Date('2019-05-14T11:01:58.135Z');
    global.Date = class extends Date {
      constructor(date) {
        if (date) {
          return super(date);
        }

        return currentDate;
      }
    };
    it('Så returenerer den dagens dato', () => {
      expect(todaysDate()).toBe('2019-4-14');
      global.Date = realDate;
    });
  });

  describe('Gitt at en ny dato lages, når toDate blir kalt', () => {
    it('Så returneres Dato som DatoObjekt', () => {
      const date = toDate(new Date('04.20.2020'));
      const d = new Date(new Date('04.20.2020'));
      expect(date).toMatchObject(d);
    });
  });
  describe('Gitt at en ny dato lages, når getMonth blir kalt', () => {
    it('Så returneres måneden', () => {
      expect(getMonthName(new Date('04-20-2020'), { monthNameApril: 'April' } as ResourcesWithMonthNames)).toBe('april');
    });
  });
});
