import 'isomorphic-fetch';
import { reachService } from './reachService';
import { ReachOpts } from '../interface/api';
import { handleError } from './reachApi/reachErrorHandling';
import { getHeaders, getUrl } from './reachApi/reachApiHeaders';
import { getBody } from './reachApi/reachApiBody';
import { reachCreateError } from './reachApi/reachApiUtils';

export async function reachApi<T = object>(
  path: string,
  optsOverride?: ReachOpts
): Promise<T> {
  try {
    const opts: ReachOpts = {
      ...reachService.get('opts'),
      ...(optsOverride || {})
    };

    const headers = getHeaders(opts);
    const body = getBody(opts);
    const url = getUrl(path, opts);

    const response = await fetch(url, {
      method: opts.method,
      headers,
      body
    });

    let data: T | null = null;

    if (response.status < 400) {
      data = opts.noJson ? response : await response.json();
    } else {
      return await handleError<T>(path, opts, response);
    }

    if (!data) {
      throw reachCreateError(404, 'Fant ikke data');
    }

    return data;
  } catch (e) {
    throw e;
  }
}

export { reachCreateError };
