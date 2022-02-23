export const openMock = jest.fn();

if (typeof window !== 'undefined') {
  window.open = openMock;
  // keep a copy of the window object to restore
  // it at the end of the tests
  const oldWindowLocation = window.location;

  // delete the existing `Location` object from `jsdom`
  delete (window as Partial<Window>).location;

  // create a new `window.location` object that's *almost*
  // like the real thing
  window.location = Object.defineProperties(
    // start with an empty object on which to define properties
    {},
    {
      // grab all of the property descriptors for the
      // `jsdom` `Location` object
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),

      // overwrite a mocked method for `window.location.assign`
      hostname: {
        writable: true,
        value: 'localhost',
      },

      // more mocked methods here as needed
    }
  ) as Window['location'];
}
