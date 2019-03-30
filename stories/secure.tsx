import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ReachProvider, ReachResource } from '../src/react';
import { saveToStorage } from '../src/utils/localStorage';

type Test = Array<{ _id: string; name: string }>;

storiesOf('Secure', module).add('Basic', () => (
  <ReachProvider
    url="https://elko-productapi.herokuapp.com"
    authorization={{
      type: 'Basic',
      token: 'a'
    }}
  >
    <ReachResource<Test> endpoint="products">
      {({ data }) => (
        <div>
          {(data || []).map(x => (
            <div>
              {x._id} : {x.name}
            </div>
          ))}
        </div>
      )}
    </ReachResource>
  </ReachProvider>
));

storiesOf('Secure', module).add('Bearer', () => {
  saveToStorage('__user__', {
    accessToken: {
      token: 'token'
    },
    loggedIn: false,
    refreshToken: {
      token: 'refreshToken'
    }
  });

  return (
    <ReachProvider
      url="http://localhost:1337"
      authorization={{
        type: 'Bearer',
        endpoint: 'http://localhost:1337/auth/get-access-token',
        token: 'Test',
        refreshToken: 'TestRefresh'
      }}
      localStorage={{
        storageKey: '__user__',
        tokenPath: 'accessToken.token',
        refreshTokenPath: 'refreshToken.token'
      }}
    >
      <ReachResource<Test> endpoint="units/mine">
        {({ data }) => (
          <div>
            {(data || []).map(x => (
              <div>
                {x._id} : {x.name}
              </div>
            ))}
          </div>
        )}
      </ReachResource>
    </ReachProvider>
  );
});
