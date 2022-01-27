import * as React from 'react';

import { YearMonthInput } from './index';

export class YearMonthInputExample extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <YearMonthInput
        id="exampleYearMonthInputField"
        minimumYearMonth={{ year: 2020, month: 2 }}
        disabled={false}
        legend="Må være mars 2020 eller senere"
      />
    );
  }
}

export default YearMonthInputExample;
