import { useReducer } from 'react';

export function useReducerState<T extends Object>(state: T) {
  const [_state, dispatch] = useReducer((oldState: T, action: any) => {
    return {
      ...oldState,
      ...action.state
    };
  }, state);

  function setState(patchState: Partial<T>) {
    dispatch({ state: patchState });
  }

  return [_state, setState];
}
