/*
 * Read configuration from the `.env` file.
 */
import { config } from 'dotenv';
config();

/*
 * Load configuration data into typed objects.
 */
export { default as pkg } from '@/../package.json';
export { ENVS, App } from './app';
