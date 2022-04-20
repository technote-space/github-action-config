import { expect, it } from 'vitest';
import { getConfig, parseConfig } from '.';

it('helper methods should be imported', () => {
  expect(getConfig).not.toBeFalsy();
  expect(parseConfig).not.toBeFalsy();
});
