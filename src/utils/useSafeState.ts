import { useState, useEffect, useRef, SetStateAction } from 'react';

export default function useSafeState<T>(
  defaultState: T
): [T, (state: SetStateAction<T>) => void] {
  const [state, setState] = useState<T>(defaultState);
  const mountedRef = useRef(false);

  function setSafeState(arg: SetStateAction<T>) {
    return mountedRef.current && setState(arg);
  }

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return [state, setSafeState];
}
