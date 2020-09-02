import React from 'react';

import { mount, shallow } from 'enzyme';
import mountHOC from '../mount';

describe('HOC utils', () => {
  describe('Gitt ...', () => {
    describe('Når ...', () => {
      const Testwebcomp: React.FC = () => {
        return <div id="testdiv">{'test'}</div>;
      };
      it('Så ...', () => {
        const myComp = mountHOC(Testwebcomp);
        // expect(document.cookie).toBe('test=cookie; MH_LoggedIn_st=test; testRandomvalue=testetstest; customcookie_st=whatever');
      });
    });
  });
});
