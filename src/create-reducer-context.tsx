import * as React from "react";

export function createReducerContext<State, Action, InitialArg>(options: {
  name: string;
  reducer: React.Reducer<State, Action>;
  initialArg: InitialArg;
  initializer: (initialArg: InitialArg) => State;
}): {
  ReducerProvider: React.FunctionComponent<{}>;
  useReducerState: () => State;
  useReducerDispatch: () => React.Dispatch<Action>;
};
export function createReducerContext<State, Action>(options: {
  name: string;
  reducer: React.Reducer<State, Action>;
  initialArg: State;
  initializer?: (initialArg: State) => State;
}): {
  ReducerProvider: React.FunctionComponent<{}>;
  useReducerState: () => State;
  useReducerDispatch: () => React.Dispatch<Action>;
};
export function createReducerContext<State, Action, InitialArg>(options: {
  name: string;
  reducer: React.Reducer<State, Action>;
  initialArg: State | InitialArg;
  initializer?: (initialArg: InitialArg | State) => State;
}): {
  ReducerProvider: React.FunctionComponent<{}>;
  useReducerState: () => State;
  useReducerDispatch: () => React.Dispatch<Action>;
} {
  const StateContext = React.createContext(null as any);

  (StateContext.Provider as any).displayName = `${name}StateProvider`;

  const DispatchContext = React.createContext(null as any);

  (DispatchContext.Provider as any).displayName = `${name}DispatchProvider`;

  options.initialArg;

  const ReducerProvider: React.FunctionComponent = ({ children }) => {
    const [state, dispatch] = React.useReducer(
      options.reducer,
      options.initialArg as State,
      options.initializer as undefined
    );

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };
  ReducerProvider.displayName = `${name}Provider`;

  function useReducerState() {
    React.useDebugValue(`${name} > useReducerState`);

    const context: State = React.useContext(StateContext);
    if (context === undefined) {
      throw new Error(
        `${name} > useReducerState: must be used within a ${
          ReducerProvider.displayName
        }`
      );
    }

    return context;
  }

  function useReducerDispatch() {
    React.useDebugValue(`${name} > useReducerDispatch`);

    const context: React.Dispatch<Action> = React.useContext(DispatchContext);
    if (context === undefined) {
      throw new Error(
        `${name} > useReducerDispatch must be used within a ${
          ReducerProvider.displayName
        }`
      );
    }
    return context;
  }

  return {
    ReducerProvider,
    useReducerState,
    useReducerDispatch
  };
}
