import path from 'path';
import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';
import { parseConfig } from './misc';
import { NOT_FOUND_STATUS } from './constant';

export const getConfig = async(fileName: string, octokit: Octokit, context: Context, options: { configPath?: string; ref?: string } = {}): Promise<object | false> | never => {
	const {configPath = '.github', ref} = options;
	try {
		const params: Octokit.ReposGetContentsParams = {
			owner: context.repo.owner,
			repo: context.repo.repo,
			path: path.posix.join(configPath, fileName),
		};
		if (ref) {
			params.ref = ref;
		}
		return parseConfig((await octokit.repos.getContents(params)).data['content']);
	} catch (error) {
		if (error.status && NOT_FOUND_STATUS === error.status) {
			return false;
		}

		throw error;
	}
};
