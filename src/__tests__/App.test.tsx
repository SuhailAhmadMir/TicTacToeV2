import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

/**
 * Adjust the regex below to match your actual heading text.
 * It is case‑insensitive and allows spaces or dashes.
 * Examples it matches:
 *   - "Play Tic Tac Toe"
 *   - "Tic‑Tac‑Toe"
 *   - "Welcome to TTT"
 */
describe('App component', () => {
  it('renders the main heading', () => {
    const { getByText } = render(<App />);
    // 🔽  Edit the pattern so it matches what you saw in Step 1
    const heading = getByText(/tic[\s-]?tac[\s-]?toe|ttt/i);
    expect(heading).toBeTruthy();
  });
});
