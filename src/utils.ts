import path from 'path';
import { GitHub } from '@actions/github/lib/github';
import { Context } from '@actions/github/lib/context';
import { parseConfig } from './misc';

export const getConfig = async(fileName: string, octokit: GitHub, context: Context, configPath = '.github'): Promise<object | false> => {
	try {
		const contents = await octokit.repos.getContents({
			owner: context.repo.owner,
			repo: context.repo.repo,
			path: path.posix.join(configPath, fileName),
		});
		return parseConfig(contents.data['content']);
	} catch (error) {
		// eslint-disable-next-line no-magic-numbers
		if (error.status && 404 === error.status) {
			return false;
		}
		throw error;
	}
};
