import * as React from 'react';
import { ReactNode } from 'react';
import {
  defaultReachProviderValues,
  ReachProviderValues,
  reachService
} from '../api';

type IContextProps = ReachProviderValues;

const ReachContext = React.createContext<ReachProviderValues>(
  defaultReachProviderValues
);

function ReachProvider({
  children,
  ...props
}: Partial<IContextProps> & JSX.ElementChildrenAttribute) {
  reachService.setValues(props);
  return (
    <ReachContext.Provider value={reachService.values}>
      {children}
    </ReachContext.Provider>
  );
}

interface IReachConsumer {
  children: (props: ReachProviderValues) => ReactNode;
}

function ReachConsumer({ children }: IReachConsumer) {
  return (
    <ReachContext.Consumer>{values => children(values)}</ReachContext.Consumer>
  );
}

export { ReachProvider, ReachConsumer };
