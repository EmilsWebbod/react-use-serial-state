import { useCallback, useReducer } from 'react';

interface Action<T extends object, K extends keyof T> {
  type?: 'EDIT_SUB';
  key?: K;
  state?: Partial<T>;
  subState?: Partial<T[K]>;
}

export default function useSerialState<T extends object>(
  state: T | null
): [
  T,
  (patchState: Partial<T>) => void,
  <K extends keyof T>(subKey: K, state: Partial<T[K]>) => void
] {
  const [_state, dispatch] = useReducer(reducer, state);

  const setState = useCallback(
    function setState(patchState: Partial<T>) {
      dispatch({ state: patchState });
    },
    [dispatch]
  );

  const set = useCallback(
    function set<K extends keyof T>(key: K, keyState: Partial<T[K]>) {
      dispatch({
        type: 'EDIT_SUB',
        key: key,
        subState: keyState
      });
    },
    [dispatch]
  );

  return [_state as T, setState, set];
}

function reducer<T extends object, K extends keyof T>(
  oldState: T | null,
  action: Action<T, K>
) {
  if (!oldState) {
    return action.state as T;
  }

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
