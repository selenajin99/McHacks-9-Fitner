"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const log_service_1 = __importDefault(require("./log.service"));
/**
 * Since metro.config.js should be stored at the project root. E.g:
 * - /
 * - /metro.config.js
 * - /package.json
 */
const PROJECT_PATH = path_1.default.resolve(__dirname, '../../../../');
class ProjectService {
}
exports.default = ProjectService;
ProjectService.resolvePath = (path) => {
    if (!path) {
        return './';
    }
    return path_1.default.resolve(PROJECT_PATH, path);
};
ProjectService.requireModule = (path) => {
    const modulePath = ProjectService.resolvePath(path);
    try {
        return require(modulePath);
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND' && ~error.message.indexOf(modulePath)) {
            return null;
        }
        else {
            log_service_1.default.warn(error);
        }
    }
};
ProjectService.requireActualModule = (relativePath) => {
    if (!ProjectService.hasModule(relativePath)) {
        return null;
    }
    const modulePath = ProjectService.resolvePath(relativePath);
    return fs_1.default.readFileSync(modulePath, { encoding: 'utf8' });
};
ProjectService.hasModule = (path) => {
    return ProjectService.requireModule(path) !== null;
};
//# sourceMappingURL=project.service.js.map