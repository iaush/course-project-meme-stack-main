import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    container: ({ children, ...rest }) => (
      <React.Fragment>
        <DocsContainer {...rest}>
          <TableOfContents className='sbdocs sbdocs-toc--custom' />
          {children}
          <BackToTop className='sbdocs sbdocs-top--custom' />
        </DocsContainer>
      </React.Fragment>
    ),
  },
};
