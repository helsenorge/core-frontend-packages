

import React, { useReducer } from 'react';




export type Props<S,A> = {
  StateContext: React.Context<S>;
  DispatchContext: React.Context<React.Dispatch<A>>;
  reducer: React.Reducer<S, A>;
  initialState: S,
  children:JSX.Element

}



function withStore<S,A>(props:Props<S,A> )  {
  const { StateContext, initialState, DispatchContext, reducer} = props;
  const [state,dispatch] = useReducer(reducer,initialState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
      </StateContext.Provider>
    )
}


export default withStore;
