import * as React from 'react';
import { YearInput } from './index';

export default class YearInputExample extends React.Component<{}, {}> {
  render(): JSX.Element {
    return <YearInput id="exampleYearInputField" disabled={false} maximumYear={2014} label="År må være før 2015" />;
  }
}
