import * as React from 'react';
import ValidationError from './../validation-error';

const Example: React.FC<{}> = () => <ValidationError isValid={false} error="Du må velge" />;
export default Example;
