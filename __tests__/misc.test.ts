/* eslint-disable no-magic-numbers */
import { encodeContent } from '@technote-space/github-action-test-helper';
import { parseConfig } from '../src/misc';

describe('parseConfig', () => {
	it('should parse config', async() => {
		expect(parseConfig(encodeContent(''))).toEqual({});
		expect(parseConfig(encodeContent('a: b'))).toEqual({a: 'b'});
		expect(parseConfig(encodeContent('a:\n  - b\n  - c'))).toEqual({a: ['b', 'c']});
	});
});
