import React from 'react';

const TabbableTestContainer: React.FC<{}> = () => {
  const containerRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  return (
    <div id="container" ref={containerRef}>
      <button></button>
      <button tabIndex={2}></button>
    </div>
  );
};

export default TabbableTestContainer;
/*
export const Avatar = React.forwardRef((props: {}, ref: React.RefObject<HTMLSpanElement>) => {
  return (
    <span className={'classes'} aria-hidden="true">
      {'content'}
    </span>
  );
});
*/
