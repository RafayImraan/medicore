import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <div>App Test</div>
      </BrowserRouter>
    );
    expect(screen.getByText('App Test')).toBeInTheDocument();
  });
});
