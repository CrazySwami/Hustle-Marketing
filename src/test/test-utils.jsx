import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that wraps components with providers
 */
function customRender(ui, options = {}) {
  const { wrapper: Wrapper, ...renderOptions } = options;

  function AllProviders({ children }) {
    // Add any providers here (context, theme, etc.)
    return Wrapper ? <Wrapper>{children}</Wrapper> : children;
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
