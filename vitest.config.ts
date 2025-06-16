import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // ← gives React a browser‑like DOM
    globals: true
  }
});
