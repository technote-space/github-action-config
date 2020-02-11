import path from 'path';
import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';
import { parseConfig } from './misc';
import { NOT_FOUND_STATUS } from './constant';

export const getConfig = async(fileName: string, octokit: Octokit, context: Context, configPath = '.github'): Promise<object | false> | never => {
	try {
		return parseConfig((await octokit.repos.getContents({
			owner: context.repo.owner,
			repo: context.repo.repo,
			path: path.posix.join(configPath, fileName),
		})).data['content']);
	} catch (error) {
		if (error.status && NOT_FOUND_STATUS === error.status) {
			return false;
		}

		throw error;
	}
};
