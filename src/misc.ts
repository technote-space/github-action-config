import yaml from 'js-yaml';

export const parseConfig = (content: string): object | false => yaml.safeLoad(Buffer.from(content, 'base64').toString()) || false;
