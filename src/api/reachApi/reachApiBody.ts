import { ReachBody, ReachOpts } from '../../interface';
import { reachService } from '../reachService';
import { reachCreateError } from './reachApiUtils';

export function getBody(opts: ReachOpts): FormData | string | undefined {
  if (opts.method === 'GET') {
    return undefined;
  }

  opts.body = opts.body ? { ...opts.body } : {};

  if (opts.auth && opts.tokenInBody) {
    try {
      addTokenToBody(opts);
    } catch (e) {
      throw e;
    }
  }

  return Object.keys(opts.body).length > 0 ? parseBody(opts) : undefined;
}

export function addTokenToBody(opts: ReachOpts) {
  const token = reachService.getAuth('token');

  if (!token || token === '') {
    throw reachCreateError(401, 'tokenNotProvided');
  }

  if (!opts.body) {
    opts.body = {};
  }
  opts.body.token = token;
}

function parseBody(opts: ReachOpts) {
  const contentType = opts.type ? opts.type : 'application/json';
  const body = { ...opts.body } as ReachBody;

  switch (contentType) {
    case 'multipart/form-data':
      return createMultipartForm(body, opts.fileKeys);
    case 'application/x-www-form-urlencoded':
      return createEncodedForm(body);
    default:
      return JSON.stringify(body);
  }
}

function createMultipartForm(
  body: ReachBody,
  fileKeys = ['file', 'files']
): FormData {
  const formData = new FormData();

  for (const k in body) {
    if (fileKeys.some(fk => fk === k)) {
      if (Array.isArray(body[k])) {
        body[k].map((file: any) => formData.append(k, file));
      } else {
        formData.append(k, body[k]);
      }
    } else if (typeof body[k] === 'object' && !Array.isArray(body[k])) {
      for (const bk in body[k]) {
        if (body[k] && body[k].hasOwnProperty(bk)) {
          formData.append(`${k}.${bk}`, body[k][bk]);
        }
      }
    } else {
      formData.append(k, body[k]);
    }
  }

  return formData;
}

function createEncodedForm(body: ReachBody): string {
  return Object.keys(body)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
    .join('&');
}
