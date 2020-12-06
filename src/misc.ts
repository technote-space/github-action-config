import yaml from 'js-yaml';

export const isYaml = (filename: string): boolean => ['yaml', 'yml'].includes(String(filename.split('.').pop()));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseYamlConfig = (content: string): { [key: string]: any } => {
  try {
    const config = yaml.safeLoad(content);
    if (!config || typeof config === 'string' || !Object.keys(config).length) {
      return {};
    }

    return config;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseJsonConfig = (content: string): { [key: string]: any } => {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(error);
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseConfig = (content: string, filename?: string): { [key: string]: any } => undefined === filename || isYaml(filename) ?
  parseYamlConfig(Buffer.from(content, 'base64').toString()) :
  parseJsonConfig(Buffer.from(content, 'base64').toString());
