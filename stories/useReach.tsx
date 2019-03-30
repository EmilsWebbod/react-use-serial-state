import { storiesOf } from '@storybook/react';
import { useReach } from '../src/react/useReach';
import { ReachProvider } from '../src/react';
import * as React from 'react';

storiesOf('User Reach', module).add('useReach', () => (
  <ReachProvider url="https://jsonplaceholder.typicode.com">
    <RenderProps />
  </ReachProvider>
));

function RenderProps() {
  const [busy, data, error, refresh] = useReach<
    Array<{ id: string; title: string }>
  >({
    endpoint: 'todos'
  });

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <div>{error && error.code}</div>
      <div>Busy: {busy ? 'true' : 'fakse'}</div>
      {!busy &&
        data &&
        data.map(x => (
          <div>
            {x.id} : {x.title}
          </div>
        ))}
    </div>
  );
}
