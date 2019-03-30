import { useReducer } from 'react';

interface Action<T, K extends keyof T = any> {
  type?: 'EDIT_SUB';
  key?: K;
  state?: Partial<T>;
  subState?: Partial<T[K]>;
}

type CorrectType<T> = T extends object ? Partial<T> : T;
type NotObject = any[] | string | number | boolean;

export default function useReducerState<T extends unknown>(
  state: T
): [
  T,
  (patchState: CorrectType<T>) => void,
  <K extends keyof T>(subKey: K, state: T[K]) => void
] {
  const [_state, dispatch] = useReducer(reducer, state);

  function reducer(oldState: T, action: any): T {
    if (typeof oldState === 'object' && !Array.isArray(oldState)) {
      return handleObject(oldState as object, action) as T;
    }
    return handleValue(oldState, action.state);
  }

  function setState(patchState: CorrectType<T>) {
    dispatch({ state: patchState });
  }

  function set<K extends keyof T>(key: K, keyState: T[K]) {
    if (typeof keyState !== 'object') {
      throw new Error('Can not use set on T !== "object"');
    }
    dispatch({
      type: 'EDIT_SUB',
      key: key,
      subState: keyState
    });
  }

  return [_state as T, setState, set];
}

function handleObject<T extends object, K extends keyof T>(
  oldState: T,
  action: Action<T, K>
) {
  switch (action.type) {
    case 'EDIT_SUB':
      return {
        ...oldState,
        [action.key as keyof T]: {
          ...oldState[action.key as keyof T],
          ...action.subState
        }
      };
    default:
      return {
        ...oldState,
        ...action.state
      };
  }
}

function handleValue<T extends NotObject>(oldState: T, newState: T) {
  return newState;
}
