import * as React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";

import { createReducerContext } from "./create-reducer-context";

afterEach(cleanup);

describe("create reducer context", () => {
  type State = {
    count: number;
  };

  type Action = "increment" | "decrement";

  const countReducer = (prevState: State, action: Action) => {
    switch (action) {
      case "increment":
        return {
          count: prevState.count + 1
        };
      case "decrement":
        return {
          count: prevState.count - 1
        };
    }
  };

  const getTestExample = (
    CountProvider: React.FunctionComponent,
    useCountState: () => State,
    useCountDispatch: () => React.Dispatch<Action>
  ) => {
    function CountDisplay() {
      const { count } = useCountState();
      return <div>{`The current count is ${count}`}</div>;
    }

    function Counter() {
      const dispatch = useCountDispatch();
      return (
        <button onClick={() => dispatch("increment")}>Increment count</button>
      );
    }

    const Usage: React.FunctionComponent = () => {
      return (
        <CountProvider>
          <CountDisplay />
          <Counter />
        </CountProvider>
      );
    };

    return Usage;
  };

  it("should work without an initializer", () => {
    const {
      ReducerProvider: CountProvider,
      useReducerState: useCountState,
      useReducerDispatch: useCountDispatch
    } = createReducerContext({
      name: "count",
      reducer: countReducer,
      initialArg: { count: 10 }
    });

    const TestExample = getTestExample(
      CountProvider,
      useCountState,
      useCountDispatch
    );

    const { getByText } = render(<TestExample />);

    fireEvent.click(getByText("Increment count"));

    expect(getByText("The current count is 11")).toBeTruthy();
  });

  it("should work with an initializer", () => {
    const {
      ReducerProvider: CountProvider,
      useReducerState: useCountState,
      useReducerDispatch: useCountDispatch
    } = createReducerContext({
      name: "count",
      reducer: countReducer,
      initialArg: 10,
      initializer: (state: number) => ({ count: state })
    });

    const TestExample = getTestExample(
      CountProvider,
      useCountState,
      useCountDispatch
    );

    const { getByText } = render(<TestExample />);

    fireEvent.click(getByText("Increment count"));

    expect(getByText("The current count is 11")).toBeTruthy();
  });
});
