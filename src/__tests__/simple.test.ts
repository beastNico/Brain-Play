import { describe, expect, test } from 'vitest';

describe('Simple Test', () => {
  test('should pass', () => {
    expect(true).toBe(true);
  });

  test('should add numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
