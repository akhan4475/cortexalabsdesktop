// Stub for Node.js built-in modules that the Anthropic SDK agent toolset
// imports but we never use in the Electron renderer process.
// The core SDK (HTTP client, messages API) uses fetch which works fine.
export default {};
export const readFile    = () => Promise.resolve('');
export const writeFile   = () => Promise.resolve();
export const mkdir       = () => Promise.resolve();
export const stat        = () => Promise.resolve({});
export const readdir     = () => Promise.resolve([]);
export const unlink      = () => Promise.resolve();
export const resolve     = (...args: string[]) => args.join('/');
export const join        = (...args: string[]) => args.join('/');
export const dirname     = (p: string) => p.split('/').slice(0, -1).join('/');
export const basename    = (p: string) => p.split('/').pop() ?? '';
export const sep         = '/';
export const randomUUID  = () => Math.random().toString(36).slice(2);
export const platform    = () => 'browser';
export const homedir     = () => '/';
