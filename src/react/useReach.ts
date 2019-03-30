import { useEffect } from 'react';
import { reachApi } from '../api';
import { ReachError, ReachOpts } from '../interface';
import { useReducerState } from './useReducerState';

interface IOpts<T> extends ReachOpts {
  endpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: ReachError) => void;
}

interface State<T> {
  busy: boolean;
  response: T | null;
  error: ReachError | null;
}

export function useReach<T extends object>(
  opts: IOpts<T>
): [boolean, T | null, ReachError | null, () => Promise<void>] {
  const [state, setState] = useReducerState<State<T>>({
    busy: false,
    response: null,
    error: null
  });

  async function fetchData() {
    if (state.busy) {
      return;
    }

    try {
      setState({ busy: true });

      const response = await reachApi<T>(opts.endpoint, opts);

      setState({ busy: false, response });

      if (typeof opts.onSuccess === 'function') {
        opts.onSuccess(response);
      }
    } catch (error) {
      setState({ busy: false, error });

      if (typeof opts.onError === 'function') {
        opts.onError(error);
      }
    }
  }

  const queryId = Object.keys(opts.query || {}).join(',');
  const bodyId = Object.keys(opts.body || {}).join(',');
  useEffect(
    () => {
      fetchData().then();
    },
    [opts.endpoint, queryId, bodyId]
  );

  return [state.busy, state.response, state.error, fetchData];
}
