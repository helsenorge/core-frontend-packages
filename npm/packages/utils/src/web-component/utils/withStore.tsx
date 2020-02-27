

import React, { useReducer, useState } from 'react';
interface withStoreProps{
  StateContext: React.Context<{}>,
  DispatchContext: React.Context<React.Dispatch<{}>>,
  reducer: React.Reducer<{}, {}>,
  initialState: {}

}
const withStore: React.FC<withStoreProps>  = (
  props: withStoreProps
) => {
  const { StateContext, initialState, DispatchContext, reducer} = props;
  const [state,dispatch] = useReducer(reducer,initialState);
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
      </StateContext.Provider>
    )
}
 

};
export default withStore;
