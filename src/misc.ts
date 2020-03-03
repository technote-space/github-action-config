import yaml from 'js-yaml';

export const parseConfig = (content: string): object | false => {
	const config = yaml.safeLoad(Buffer.from(content, 'base64').toString());
	if (!config || !Object.keys(config).length) {
		return false;
	}

	return config;
};
