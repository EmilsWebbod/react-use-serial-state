import { ReachError, ReachOpts } from '../../interface';
import { ERROR } from '../../utils/constants';
import { reachApi } from '../reachApi';
import { reachService } from '../reachService';
import refreshAccessToken from './refreshAccessToken';
import { reachCreateError } from './reachApiUtils';

export async function handleError<T>(
  path: string,
  opts: ReachOpts,
  response: Response
) {
  if (response.status === 403) {
    if (reachService.getAuth('type') === 'Bearer') {
      if (
        opts.headers &&
        (opts.headers.Authorization || opts.headers.Authorization === '')
      ) {
        delete opts.headers.Authorization;
      }
      await refreshAccessToken();
      return await reachApi<T>(path, opts);
    } else {
      throw await handle400(response);
    }
  } else if (response.status < 500) {
    throw await handle400(response);
  } else {
    throw await handle500(response);
  }
}

export async function handle400(response: Response): Promise<ReachError> {
  let message: string =
    response.status in ERROR.STATUS
      ? ERROR.STATUS[response.status]
      : '40x feil';
  return reachCreateError(response.status, message, response);
}

export async function handle500(response: Response): Promise<ReachError> {
  let text = await response.text();

  if (text.match(/<html/)) {
    const match = text.match(/Error:\s([^<&]*)/);
    if (match) {
      return reachCreateError(500, match[1], response);
    }
  }

  return reachCreateError(500, text, response);
}
