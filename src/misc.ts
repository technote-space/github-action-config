import { load } from 'js-yaml';

export const isYaml = (filename: string): boolean => ['yaml', 'yml'].includes(String(filename.split('.').pop()));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseYamlConfig = (content: string): { [key: string]: any } => {
  try {
    const config = load(content) as never;
    if (!config || typeof config !== 'object') {
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
