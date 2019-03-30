import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ReachResource } from '../src/react';

type Test = Array<{ id: string; title: string }>;
type Test2 = Array<{ id: string; body: string }>;

storiesOf('ReactResource', module).add('default', () => (
  <ReachResource<Test, Test2>
    endpoint="posts"
    params={{ id: 1 }}
    noEmptyState
    noBusyState
    secondaryEndpoint="comments"
    secondaryParams={{ postId: 1 }}
  >
    {({ data, secondaryData, refresh, busy }) => (
      <>
        {busy ? 'Updating' : ''}
        <h1>Posts</h1>
        {(data || []).map(x => (
          <div>
            {x.id} : {x.title}
          </div>
        ))}
        <h2>Comments</h2>
        {(secondaryData || []).map(comment => (
          <div>
            {comment.id} : {comment.body}
          </div>
        ))}
        <button onClick={() => refresh()}>Refresh</button>
      </>
    )}
  </ReachResource>
));

storiesOf('ReactResource', module).add('EmptyState', () => {
  return (
    <ReachResource<Test> endpoint="todos?id=11111">
      {({ data }) => (
        <>
          {(data || []).map(x => (
            <div>
              {x.id} : {x.title}
            </div>
          ))}
        </>
      )}
    </ReachResource>
  );
});

storiesOf('ReactResource', module).add('ErrorState', () => {
  return (
    <ReachResource<Test> endpoint="todoss">
      {({ data }) => (
        <>
          {(data || []).map(x => (
            <div>
              {x.id} : {x.title}
            </div>
          ))}
        </>
      )}
    </ReachResource>
  );
});
