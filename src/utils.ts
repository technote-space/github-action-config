import {join} from 'path';
import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {RestEndpointMethods} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import {parseConfig} from './misc';
import {NOT_FOUND_STATUS} from './constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConfig = async(fileName: string, octokit: Octokit, context: Context, options: { configPath?: string; ref?: string } = {}): Promise<{ [key: string]: any } | boolean> | never => {
  const {configPath = '.github', ref} = options;
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

    return parseConfig((await (octokit as RestEndpointMethods).repos.getContent(params)).data['content']);
  } catch (error) {
    if (error.status && NOT_FOUND_STATUS === error.status) {
      return false;
    }

    throw error;
  }
};
