import * as React from 'react';
import { ReactNode } from 'react';
import { reachCreateError, reachService } from '../../api';
import {
  ReachBusyState,
  ReachEmptyState,
  ReachErrorState,
  ReachStatusWrapper
} from '../../interface/react';

export type IResourceState = 'empty' | 'busy' | 'data' | number;

interface IProps {
  state: IResourceState;
  errorStatus: number;
  error: string;
  StatusWrapper?: ReachStatusWrapper;
  EmptyState?: ReachEmptyState;
  BusyState?: ReachBusyState;
  ErrorState?: ReachErrorState;
}

export default class ReachResourceState extends React.Component<IProps> {
  render() {
    switch (this.props.state) {
      case 'empty':
        return this.renderEmpty();
      case 'busy':
        return this.renderBusy();
      case 'data':
        return this.renderData();
      default:
        return this.renderError();
    }
  }

  private renderEmpty() {
    const { EmptyState } = this.props;
    const Component = EmptyState ? EmptyState : reachService.get('EmptyState');
    return <Component />;
  }

  private renderBusy() {
    const { BusyState, StatusWrapper } = this.props;

    const Wrapper = StatusWrapper
      ? StatusWrapper
      : reachService.get('StatusWrapper');
    const Component = BusyState ? BusyState : reachService.get('BusyState');
    return (
      <Wrapper busy={true}>
        {Component ? <Component /> : this.props.children || {}}
      </Wrapper>
    );
  }

  private renderData() {
    return this.props.children;
  }

  private renderError(): ReactNode {
    const { ErrorState, errorStatus, error } = this.props;

    const ReachError = ErrorState ? ErrorState : reachService.get('ErrorState');

    return <ReachError error={reachCreateError(errorStatus, error)} />;
  }
}
