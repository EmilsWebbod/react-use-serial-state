import {
  ReachBusyState,
  ReachContentTypes,
  ReachEmptyState,
  ReachErrorState,
  ReachOpts,
  ReachStatusWrapper
} from '../../interface';

export type AuthorizationBasic = 'Basic';
export type AuthorizationBearer = 'Bearer';
export type AuthorizationTypes = AuthorizationBasic | AuthorizationBearer;

export type ReachBasicAuth = {
  type: AuthorizationBasic;
  token: string;
};

export type ReachBearerAuth = {
  type: AuthorizationBearer;
  endpoint: string;
  token?: string;
  refreshToken?: string;
  contentType?: ReachContentTypes;
};

export interface ReachLocalStorage {
  storageKey: string;
  tokenPath: string;
  refreshTokenPath?: string;
}

export interface ReachProviderValues {
  url: string;
  headers: Headers;
  opts: ReachOpts;
  authorization: ReachBasicAuth | ReachBearerAuth;
  localStorage: ReachLocalStorage;
  StatusWrapper: ReachStatusWrapper;
  EmptyState: ReachEmptyState;
  BusyState: ReachBusyState;
  ErrorState: ReachErrorState;
  onLogout: () => void;
}

export type IAuthorization = ReachBasicAuth | ReachBearerAuth;
export type ReachLocalStoragePaths = Exclude<
  keyof ReachLocalStorage,
  'storageKey'
>;
