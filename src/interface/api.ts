export type IMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ReachContentTypes =
  | 'application/json'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded';

export interface ReachBody {
  [key: string]: any;
}

export interface ReachHeaders {
  [key: string]: any;
}

export interface ReachQuery {
  [key: string]: any;
}

export interface ReachError {
  code: number;
  message: string;
  details?: Response;
}

export interface ReachOpts {
  type?: ReachContentTypes;
  noJson?: boolean;
  method?: IMethods;
  auth?: boolean;
  fileKeys?: string[];
  body?: ReachBody;
  query?: ReachQuery;
  headers?: ReachHeaders;
  usePathAsUrl?: boolean;
  tokenInBody?: boolean;
  credentials?: RequestCredentials;
}
