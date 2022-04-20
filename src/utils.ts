import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
import { join } from 'path';
import { NOT_FOUND_STATUS } from './constant';
import { parseConfig } from './misc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConfig = async(fileName: string, octokit: Octokit, context: Context, options: { configPath?: string; ref?: string } = {}): Promise<{ [key: string]: any } | false> | never => {
  const { configPath = '.github', ref } = options;
  try {
    const params: {
      owner: string;
      repo: string;
      path: string;
      ref?: string;
    } = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: join(configPath, fileName),
    };
    if (ref) {
      params.ref = ref;
    }

    return parseConfig((await octokit.rest.repos.getContent(params)).data['content']);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (error.status && NOT_FOUND_STATUS === error.status) {
      return false;
    }

    throw error;
  }
};
