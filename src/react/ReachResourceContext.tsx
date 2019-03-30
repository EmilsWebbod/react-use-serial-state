import * as React from 'react';
import { Context } from 'react';
import {
  IReachChildrenProps,
  IReachOpts,
  IReachProps,
  ReachResource
} from './ReachResource';

export class ReachResourceContext<T, U = null> {
  private _Context: Context<IReachChildrenProps<T, U>> = React.createContext<
    IReachChildrenProps<T, U>
  >({
    busy: false,
    data: null,
    refresh: (opts?: IReachOpts<T, U>) => {
      throw new Error('ReachResourceContext: refresh not provided');
    },
    putField: (fields: string[], data: any) => {
      throw new Error('ReachResourceContext: putField not provided');
    }
  });

  constructor() {
    this.Provider = this.Provider.bind(this);
  }

  get Consumer() {
    return this._Context.Consumer;
  }

  public Provider({ children, ...props }: IReachProps<T>) {
    const Provider = this._Context.Provider;
    return (
      <ReachResource<T, any> {...props}>
        {child => <Provider value={child}>{children(child)}</Provider>}
      </ReachResource>
    );
  }
}
