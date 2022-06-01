/* eslint-disable no-magic-numbers */
import { encodeContent, spyOnStdout, stdoutCalledWith, getLogStdout } from '@technote-space/github-action-test-helper';
import { describe, expect, it } from 'vitest';
import { isYaml, parseConfig, parseYamlConfig, parseJsonConfig } from './misc.js';

describe('isYaml', () => {
  it('should return true', () => {
    expect(isYaml('test.yaml')).toBe(true);
    expect(isYaml('/tmp/test.yml')).toBe(true);
    expect(isYaml('.yml')).toBe(true);
  });

  it('should return false', () => {
    expect(isYaml('')).toBe(false);
    expect(isYaml('.eslintrc')).toBe(false);
    expect(isYaml('LICENSE')).toBe(false);
    expect(isYaml('/tmp/test.txt')).toBe(false);
  });
});

describe('parseYamlConfig', () => {
  it('should parse config', async() => {
    expect(parseYamlConfig('a: b')).toEqual({ a: 'b' });
    expect(parseYamlConfig('a:\n  - b\n  - c')).toEqual({ a: ['b', 'c'] });
  });

  it('should return empty if empty', () => {
    expect(parseYamlConfig('')).toEqual({});
  });

  it('should return empty if error', () => {
    const mockStdout = spyOnStdout();
    expect(parseYamlConfig('Test1\nTest2: Test3')).toEqual({});
    stdoutCalledWith(mockStdout, [
      getLogStdout({
        name: 'YAMLException',
        reason: 'end of the stream or a document separator is expected',
        mark: {
          name: null,
          buffer: 'Test1\nTest2: Test3\n',
          position: 11,
          line: 1,
          column: 5,
          snippet: ' 1 | Test1\n 2 | Test2: Test3\n----------^',
        },
        message: 'end of the stream or a document separator is expected (2:6)\n\n 1 | Test1\n 2 | Test2: Test3\n----------^',
      }, '__error__'),
    ]);
  });
});

describe('parseJsonConfig', () => {
  it('should parse config', async() => {
    expect(parseJsonConfig('{"a": "b"}')).toEqual({ a: 'b' });
    expect(parseJsonConfig('{"a": ["b", "c"]}')).toEqual({ a: ['b', 'c'] });
  });

  it('should return empty if error', () => {
    const mockStdout = spyOnStdout();
    expect(parseJsonConfig('')).toEqual({});
    expect(parseJsonConfig('[1, 2,]')).toEqual({});
    stdoutCalledWith(mockStdout, [
      getLogStdout({}, '__error__'),
      getLogStdout({}, '__error__'),
    ]);
  });
});

describe('parseConfig', () => {
  it('should parse yaml', async() => {
    expect(parseConfig(encodeContent('a: b'))).toEqual({ a: 'b' });
    expect(parseConfig(encodeContent('a: b'), 'test.yaml')).toEqual({ a: 'b' });
  });

  it('should parse json', () => {
    expect(parseConfig(encodeContent('{"a": "b"}'), 'test.json')).toEqual({ a: 'b' });
    expect(parseConfig(encodeContent('{"a": "b"}'), '.eslintrc')).toEqual({ a: 'b' });
  });
});
