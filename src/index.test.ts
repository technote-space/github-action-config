import { expect, it } from 'vitest';
import { getConfig, parseConfig } from './index.js';

it('helper methods should be imported', () => {
  expect(getConfig).not.toBeFalsy();
  expect(parseConfig).not.toBeFalsy();
});
