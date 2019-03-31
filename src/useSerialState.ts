import { useReducer } from 'react';

interface Action<T, K extends keyof T = any> {
  type?: 'EDIT_SUB';
  key?: K;
  state?: Partial<T>;
  subState?: Partial<T[K]>;
}

export default function useSerialState<T extends object>(
  state: T
): [
  T,
  (patchState: Partial<T>) => void,
  <K extends keyof T>(subKey: K, state: Partial<T[K]>) => void
] {
  const [_state, dispatch] = useReducer(reducer, state);

  function setState(patchState: Partial<T>) {
    dispatch({ state: patchState });
  }

  function set<K extends keyof T>(key: K, keyState: Partial<T[K]>) {
    dispatch({
      type: 'EDIT_SUB',
      key: key,
      subState: keyState
    });
  }

  return [_state as T, setState, set];
}

function reducer<T extends object, K extends keyof T>(
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
