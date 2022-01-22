"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processor_1 = require("@eva-design/processor");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const eva_config_service_1 = __importDefault(require("./eva-config.service"));
const log_service_1 = __importDefault(require("./log.service"));
const project_service_1 = __importDefault(require("./project.service"));
const DEFAULT_CHECKSUM = 'default';
const CACHE_FILE_NAME = 'generated.json';
const CACHE_EXPORT_SIGNATURE = `\n\nexports.styles = require('./${CACHE_FILE_NAME}').styles`;
const RELATIVE_PATHS = {
    evaPackage: (evaPackage) => {
        return `node_modules/${evaPackage}`;
    },
    evaMapping: (evaPackage) => {
        return `node_modules/${evaPackage}/mapping.json`;
    },
    evaIndex: (evaPackage) => {
        return `node_modules/${evaPackage}/index.js`;
    },
    cache: (evaPackage) => {
        return `node_modules/${evaPackage}/${CACHE_FILE_NAME}`;
    },
};
const schemaProcessor = new processor_1.SchemaProcessor();
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
class BootstrapService {
}
exports.default = BootstrapService;
BootstrapService.run = (config) => {
    const hasAtLeastOneEvaPackage = BootstrapService.ensureEvaPackagesInstalledOrWarn();
    const isValidConfig = eva_config_service_1.default.validateConfigOrWarn(config);
    if (hasAtLeastOneEvaPackage && isValidConfig) {
        BootstrapService.processMappingIfNeeded(config);
    }
};
BootstrapService.ensureEvaPackagesInstalledOrWarn = () => {
    const numberOfInstalledEvaPackages = eva_config_service_1.default.MAPPING_PACKAGE_NAMES.reduce((acc, packageName) => {
        const evaPackageRelativePath = RELATIVE_PATHS.evaPackage(packageName);
        const isEvaPackageInstalled = project_service_1.default.hasModule(evaPackageRelativePath);
        return isEvaPackageInstalled ? acc + 1 : acc;
    }, 0);
    if (numberOfInstalledEvaPackages === 0) {
        log_service_1.default.warn('This project has no Eva packages installed.', '', 'Consider installing one of the following packages:', '', ...eva_config_service_1.default.MAPPING_PACKAGE_NAMES);
        return false;
    }
    return true;
};
BootstrapService.processMappingIfNeeded = (config) => {
    const evaMappingPath = RELATIVE_PATHS.evaMapping(config.evaPackage);
    const outputCachePath = RELATIVE_PATHS.cache(config.evaPackage);
    /*
     * Use `require` for eva mapping as it is static module and should not be changed.
     * Require actual cache by reading file at cache file as it may change by file system.
     */
    const evaMapping = project_service_1.default.requireModule(evaMappingPath);
    const actualCacheString = project_service_1.default.requireActualModule(outputCachePath);
    const actualCache = JSON.parse(actualCacheString);
    let customMapping;
    let actualChecksum = DEFAULT_CHECKSUM;
    let nextChecksum = DEFAULT_CHECKSUM;
    if (actualCache && actualCache.checksum) {
        actualChecksum = actualCache.checksum;
    }
    if (config.customMappingPath) {
        /*
         * Require custom mapping by reading file at `customMappingPath` as it may change by user.
         */
        const customMappingString = project_service_1.default.requireActualModule(config.customMappingPath);
        customMapping = JSON.parse(customMappingString);
        /*
         * Calculate checksum only for custom mapping,
         * but not for styles we generate because eva mapping is a static module.
         */
        nextChecksum = BootstrapService.createChecksum(customMappingString);
    }
    /*
     * Write if it is the first call
     * Or re-write if custom mapping was changed
     */
    if (actualChecksum === DEFAULT_CHECKSUM || actualChecksum !== nextChecksum) {
        const mapping = lodash_merge_1.default({}, evaMapping, customMapping);
        const styles = schemaProcessor.process(mapping);
        const writableCache = BootstrapService.createWritableCache(nextChecksum, styles);
        fs_1.default.writeFileSync(outputCachePath, writableCache);
    }
    const hasCacheExports = BootstrapService.hasCacheExports(config);
    if (!hasCacheExports) {
        const evaIndexPath = RELATIVE_PATHS.evaIndex(config.evaPackage);
        fs_1.default.appendFileSync(evaIndexPath, CACHE_EXPORT_SIGNATURE);
        log_service_1.default.success(`Successfully bootstrapped ${config.evaPackage}`);
    }
};
BootstrapService.hasCacheExports = (config) => {
    const evaIndexPath = RELATIVE_PATHS.evaIndex(config.evaPackage);
    const evaIndexString = project_service_1.default.requireActualModule(evaIndexPath);
    return evaIndexString.includes(CACHE_EXPORT_SIGNATURE);
};
BootstrapService.createWritableCache = (checksum, styles) => {
    const cache = {
        checksum,
        styles,
    };
    return JSON.stringify(cache, null, 2);
};
BootstrapService.createChecksum = (target) => {
    return crypto_1.default.createHash('sha1')
        .update(target)
        .digest('hex');
};
//# sourceMappingURL=bootstrap.service.js.map