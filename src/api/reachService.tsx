import 'isomorphic-fetch';
import {
  IAuthorization,
  ReachBearerAuth,
  ReachProviderValues
} from './reachService/reachServiceTypes';
import {
  getLocalValue,
  setLocalValue
} from './reachService/reachServiceLocalStorage';
import { defaultReachProviderValues } from './reachService/reachServiceUtils';

let instance: ReachService;

class ReachService {
  private _values: ReachProviderValues = defaultReachProviderValues;
  public refreshingToken: boolean = false;

  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  public get<K extends keyof ReachProviderValues>(
    key: K
  ): ReachProviderValues[K] {
    return this._values[key];
  }

  public set<K extends keyof ReachProviderValues>(
    key: K,
    value: ReachProviderValues[K]
  ) {
    this._values[key] = value;
  }

  public getAuth<T extends IAuthorization, K extends keyof T = keyof T>(
    key: K
  ): T[K] | null {
    if (this._values.authorization) {
      return (this._values.authorization as T)[key] as T[K];
    }
    return null;
  }

  get values() {
    return this._values;
  }

  public setValues(values: Partial<ReachProviderValues>) {
    if (values.authorization) {
      if (!values.opts) {
        this._values.opts.auth = true;
      }
    } else {
      delete values.authorization;
    }

    this._values = {
      ...this._values,
      ...values
    };

    this.setStorage();
  }

  get token(): string {
    try {
      return getLocalValue(this.get('localStorage'), 'tokenPath') || '';
    } catch (e) {
      throw e;
    }
  }

  set token(token: string) {
    try {
      setLocalValue(this.get('localStorage'), 'tokenPath', token);
      this.setAuthFromStorage();
    } catch (e) {
      throw e;
    }
  }

  get refreshToken(): string {
    try {
      return getLocalValue(this.get('localStorage'), 'refreshTokenPath') || '';
    } catch (e) {
      throw e;
    }
  }

  set refreshToken(refreshToken: string) {
    try {
      setLocalValue(this.get('localStorage'), 'refreshTokenPath', refreshToken);
      this.setAuthFromStorage();
    } catch (e) {
      throw e;
    }
  }

  public logout() {
    this.get('onLogout')();
  }

  private setStorage() {
    this.token = this.getAuth('token') || '';
    if ('refreshToken' in this.get('authorization')) {
      this.refreshToken =
        (this.getAuth<ReachBearerAuth>('refreshToken') as string) || '';
    }
  }

  private setAuthFromStorage() {
    this._values.authorization.token = this.token;
    if ('refreshToken' in this._values.authorization) {
      this._values.authorization.refreshToken = this.refreshToken;
    }
  }
}

const reachService = new ReachService();

export {
  reachService,
  defaultReachProviderValues,
  ReachProviderValues,
  ReachBearerAuth
};
