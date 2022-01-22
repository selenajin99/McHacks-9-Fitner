import { EvaConfig } from './eva-config.service';
/**
 * Generates styles for `@eva-design/*` package specified in EvaConfig
 *
 * @see EvaConfig
 *
 * 1. Finds installed `@eva-design/*` packages.
 * Will warn if there is no valid eva mapping packages installed and do nothing.
 *
 * @see EvaConfigService.MAPPING_PACKAGE_NAMES
 *
 * 2. Validates specified eva config  by checking if `evaPackage` is specified and is one of the valid mapping packages.
 * Will warn if it is not valid and do nothing.
 *
 * 3. Generates styles for specified `evaPackage` and stores it into cache file in the package directory.
 * @see {CACHE_FILE_NAME}
 * @see {EvaCache}
 *
 * E.g, if `evaPackage` is `@eva-design/eva`:
 * The result will be stored at `./node_modules/@eva-design/eva/generated.json`
 */
export default class BootstrapService {
    static run: (config: EvaConfig) => void;
    private static ensureEvaPackagesInstalledOrWarn;
    private static processMappingIfNeeded;
    private static hasCacheExports;
    private static createWritableCache;
    private static createChecksum;
}
