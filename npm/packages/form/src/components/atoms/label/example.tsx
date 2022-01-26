import * as React from 'react';
import { Label } from '\.';

const LabelExample: React.FC<{}> = () => {
  return (
    <div>
      <p>{'-> Label med text og children'}</p>
      <Label labelText="This is my label as a string " htmlFor={'my-field-id1'} testId="Label">
        {'And its nested child'}
      </Label>
      <p>
        <br />
      </p>
      <p>{'-> Label med enriched text og sublabel'}</p>
      <Label
        labelText={
          <React.Fragment>
            {'This is my enriched label '}
            <em>{'(With some optional info)'}</em>
          </React.Fragment>
        }
        sublabelText={'And my sublabel'}
        htmlFor={'my-field-id2'}
      />
    </div>
  );
};

export default LabelExample;
