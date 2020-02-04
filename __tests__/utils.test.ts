/* eslint-disable no-magic-numbers */
import nock from 'nock';
import path from 'path';
import { Octokit } from '@octokit/rest';
import { disableNetConnect, getConfigFixture, getContext } from '@technote-space/github-action-test-helper';
import { getConfig } from '../src';

describe('getConfig', () => {
	disableNetConnect(nock);
	const octokit = new Octokit({auth: 'token test-token'});

	it('should get config', async() => {
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures'), 'config.yml'));

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
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures'), 'error.yml'));

		await expect(getConfig('config.yml', octokit, getContext({
			repo: {
				owner: 'hello',
				repo: 'world',
			},
		}), '.test')).rejects.toThrow();
	});
});
