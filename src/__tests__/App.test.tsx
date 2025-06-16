import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  it('renders an H1 heading', () => {
    render(<App />);
    // grab the first-level heading regardless of text
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeTruthy();
  });
});
