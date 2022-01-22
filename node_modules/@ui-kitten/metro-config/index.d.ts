import { EvaConfig } from './services/eva-config.service';
/**
 * Creates custom Metro config for bootstrapping Eva packages.
 *
 * @param {EvaConfig} evaConfig - configuration of Eva Design System used in project.
 * @see {EvaConfig}
 *
 * @param metroConfig - configuration of Metro Bundler used in project.
 * @link https://facebook.github.io/metro/docs/configuration
 *
 * @returns a combination of two metro configurations.
 *
 * @example Usage
 *
 * ```metro.config.js
 * const MetroConfig = require('@ui-kitten/metro-config');
 *
 * const evaConfig = {
 *   evaPackage: '@eva-design/eva',              // Required.
 *   customMappingPath: './custom-mapping.json', // Optional.
 * };
 *
 * module.exports = MetroConfig.create(evaConfig, {
 *   // Whatever was previously specified
 * });
 * ```
 */
export declare const create: (evaConfig: EvaConfig, metroConfig?: any) => any;
