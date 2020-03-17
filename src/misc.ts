import yaml from 'js-yaml';

export const isYaml = (filename: string): boolean => ['yaml', 'yml'].includes(String(filename.split('.').pop()));

export const parseYamlConfig = (content: string): object => {
	try {
		const config = yaml.safeLoad(content);
		if (!config || !Object.keys(config).length) {
			return {};
		}

		return config;
	} catch (error) {
		console.error(error);
		return {};
	}
};

export const parseJsonConfig = (content: string): object => {
	try {
		return JSON.parse(content);
	} catch (error) {
		console.error(error);
		return {};
	}
};

export const parseConfig = (content: string, filename?: string): object => undefined === filename || isYaml(filename) ?
	parseYamlConfig(Buffer.from(content, 'base64').toString()) :
	parseJsonConfig(Buffer.from(content, 'base64').toString());
