import { describe, it, expect } from 'vitest';

describe('Broken Test', () => {
  it('should fail', () => {
    expect(true).toBe(false); // This will fail
  });
});