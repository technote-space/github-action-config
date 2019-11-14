import path from 'path';
import { GitHub } from '@actions/github/lib/github';
import { Context } from '@actions/github/lib/context';
import { parseConfig } from './misc';
import { NOT_FOUND_STATUS } from './constant';

export const getConfig = async(fileName: string, octokit: GitHub, context: Context, configPath = '.github'): Promise<object | false> => {
	try {
		const contents = await octokit.repos.getContents({
			owner: context.repo.owner,
			repo: context.repo.repo,
			path: path.posix.join(configPath, fileName),
		});
		return parseConfig(contents.data['content']);
	} catch (error) {
		if (error.status && NOT_FOUND_STATUS === error.status) {
			return false;
		}
		throw error;
	}
};
