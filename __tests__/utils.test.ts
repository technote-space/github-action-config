/* eslint-disable no-magic-numbers */
import nock from 'nock';
import { resolve } from 'path';
import { Octokit } from '@octokit/rest';
import { disableNetConnect, getConfigFixture, getContext } from '@technote-space/github-action-test-helper';
import { getConfig } from '../src';

const fixturesDir = resolve(__dirname, 'fixtures');

describe('getConfig', () => {
	disableNetConnect(nock);
	const octokit = new Octokit({auth: 'token test-token'});

	it('should get config', async() => {
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(fixturesDir, 'config.yml'));

		const config = await getConfig('config.yml', octokit, getContext({
			repo: {
				owner: 'hello',
				repo: 'world',
			},
		}));

		expect(config).toHaveProperty('Backlog');
		expect(config['Backlog']).toHaveProperty('test1');
		expect(typeof config['Backlog']['test1']).toBe('object');
		expect(typeof config['Backlog']['test2']).toBe('object');
	});

	it('should get config (specify ref)', async() => {
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.json?ref=feature%2Fchange')
			.reply(200, getConfigFixture(fixturesDir, 'config.json'));

		const config = await getConfig('config.json', octokit, getContext({
			repo: {
				owner: 'hello',
				repo: 'world',
			},
		}), {ref: 'feature/change'});

		expect(config).toHaveProperty('Backlog');
		expect(config['Backlog']).toHaveProperty('test1');
		expect(typeof config['Backlog']['test1']).toBe('object');
		expect(typeof config['Backlog']['test2']).toBe('object');
	});

	it('should not get config', async() => {
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(404);

		expect(await getConfig('config.yml', octokit, getContext({
			repo: {
				owner: 'hello',
				repo: 'world',
			},
		}))).toBe(false);
	});

	it('should throw error', async() => {
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.test/config.yml')
			.reply(500);

		await expect(getConfig('config.yml', octokit, getContext({
			repo: {
				owner: 'hello',
				repo: 'world',
			},
		}), {configPath: '.test'})).rejects.toThrow();
	});
});
