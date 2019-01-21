import { ReachBearerAuth, reachService } from '../reachService';
import { reachApi, reachCreateError } from '../reachApi';

interface AccessToken {
  token: string;
  expires: Date;
  data: any;
}

async function refreshAccessToken(): Promise<void> {
  try {
    const auth = reachService.get('authorization') as ReachBearerAuth;
    const refreshToken = auth.refreshToken;
    const type = auth.contentType;
    const endpoint =
      auth.endpoint !== '' ? auth.endpoint : reachService.get('url');

    if (reachService.refreshingToken) {
      return;
    }

    if (!refreshToken || refreshToken === '') {
      reachService.logout();
      throw reachCreateError(
        401,
        'Kan ikke hente ny tilgangs token. Ingen refresh token gitt'
      );
    }

    reachService.refreshingToken = true;

    const response: AccessToken = await reachApi<AccessToken>(endpoint, {
      method: 'POST',
      auth: false,
      body: { refreshToken },
      usePathAsUrl: true,
      ...(type ? { type } : {})
    });

    reachService.refreshingToken = false;
    reachService.token = response.token;
  } catch (e) {
    reachService.logout();
    reachService.refreshingToken = false;
    throw e;
  }
}

export default refreshAccessToken;
