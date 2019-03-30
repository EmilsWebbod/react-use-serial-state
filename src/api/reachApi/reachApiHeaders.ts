import { ReachOpts } from '../../interface';
import { reachService } from '../reachService';
import { reachCreateError } from '../reachApi';
import { addTokenToBody } from './reachApiBody';
import * as qs from 'qs';

export function getUrl(path: string, opts: ReachOpts) {
  const values = reachService.values;
  let params = '';

  if (opts.auth && opts.tokenInBody) {
    try {
      addTokenToBody(opts);
    } catch (e) {
      throw e;
    }
  }

  const queries = {
    ...opts.body,
    ...opts.query
  };

  if (opts.method === 'GET' && (opts.body || opts.query)) {
    params = `/?${qs.stringify(queries)}`;
  }

  return `${opts.usePathAsUrl ? '' : values.url + '/'}${path}${params}`;
}

export function getHeaders(opts: ReachOpts) {
  const token = reachService.getAuth('token');
  if (
    opts.auth &&
    (!opts.headers ||
      !opts.headers.Authorization ||
      opts.headers.Authorization !== token)
  ) {
    const type = reachService.getAuth('type');

    if (!type) {
      throw reachCreateError(401, 'Missing Authorization "type"');
    }
    if (!token) {
      throw reachCreateError(401, 'Missing Authorization "token"');
    }

    opts.headers = {
      ...(opts.headers || {}),
      Authorization: `${type} ${token}`
    };
  }

  const headers = combineHeaders(opts.headers);

  switch (opts.type) {
    case 'multipart/form-data':
      break;
    case 'application/x-www-form-urlencoded':
      headers.append('Content-Type', opts.type);
      break;
    default:
      headers.append('Content-Type', 'application/json');
      break;
  }

  return headers;
}

function combineHeaders(headers?: { [key: string]: string }) {
  const _headers = new Headers(reachService.get('headers'));

  if (!headers) {
    return _headers;
  }

  for (const header in headers) {
    _headers.set(header, headers[header]);
  }

  return _headers;
}
