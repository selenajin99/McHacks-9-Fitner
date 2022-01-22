"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_service_1 = __importDefault(require("./log.service"));
const project_service_1 = __importDefault(require("./project.service"));
class EvaConfigService {
}
exports.default = EvaConfigService;
EvaConfigService.MAPPING_PACKAGE_NAMES = [
    '@eva-design/eva',
    '@eva-design/material',
];
EvaConfigService.validateConfigOrWarn = (config) => {
    if (!config.evaPackage || !EvaConfigService.isValidEvaPackageName(config.evaPackage)) {
        log_service_1.default.warn(`There is no Eva package specified in UI Kitten metro config`, `Consider setting "evaPackage" property of UI Kitten metro config`, 'to one of the following values:', '', ...EvaConfigService.MAPPING_PACKAGE_NAMES);
        return false;
    }
    const isEvaPackageInstalled = project_service_1.default.hasModule(`node_modules/${config.evaPackage}`);
    if (!isEvaPackageInstalled) {
        log_service_1.default.warn(`UI Kitten metro config has ${config.evaPackage} specified`, 'but it seems to be not installed', '', `Consider installing ${config.evaPackage} and running this command again.`);
        return false;
    }
    return true;
};
EvaConfigService.isValidEvaPackageName = (name) => {
    return EvaConfigService.MAPPING_PACKAGE_NAMES.includes(name);
};
//# sourceMappingURL=eva-config.service.js.map