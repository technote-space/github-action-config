/* eslint-disable no-magic-numbers */
import { encodeContent } from '@technote-space/github-action-test-helper';
import { parseConfig } from '../src/misc';

describe('parseConfig', () => {
	it('should parse config', async() => {
		expect(parseConfig(encodeContent('a: b'))).toEqual({a: 'b'});
		expect(parseConfig(encodeContent('a:\n  - b\n  - c'))).toEqual({a: ['b', 'c']});
	});

	it('should return false if empty', () => {
		expect(parseConfig(encodeContent(''))).toEqual(false);
	});

	it('should throw error', () => {
		expect(() => {
			expect(parseConfig(encodeContent('Test1\nTest2: Test3'))).toEqual(false);
		}).toThrow();
	});
});
