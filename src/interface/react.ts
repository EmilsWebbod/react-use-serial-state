import { ReachError } from '../interface/api';

export type ReachStatusWrapper = (
  { busy }: { busy: boolean } & JSX.ElementChildrenAttribute
) => any;
export type ReachBusyState = () => JSX.Element;
export type ReachEmptyState = () => JSX.Element;
export type ReachErrorState = ({ error }: { error: ReachError }) => JSX.Element;
