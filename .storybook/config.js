import * as React from 'react';
import { addDecorator, configure } from '@storybook/react';

const EmptyState = () => <>Fant ikke resurs</>;
const BusyState = () => <>Laster...</>;
const ErrorState = ({ error }) => (
  <>
    FEIL!: {error.code} : {error.message}
  </>
);

addDecorator(story => {
  return story();
});

const req = require.context('../stories', true, /\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
