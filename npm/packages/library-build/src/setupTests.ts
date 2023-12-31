// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'isomorphic-fetch';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

// configuring enzyme adapter
configure({ adapter: new Adapter() });

declare global {
  interface Window {
    HN: Record<string, unknown>;
  }
}

window.HN = {};
