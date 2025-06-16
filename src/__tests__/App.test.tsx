import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders Tic Tac Toe heading', () => {
    const { getByText } = render(<App />);
    expect(getByText(/tic tac toe/i)).toBeTruthy();
  });
});
