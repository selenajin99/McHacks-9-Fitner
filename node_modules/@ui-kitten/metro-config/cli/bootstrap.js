"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_service_1 = __importDefault(require("../services/bootstrap.service"));
const BOOTSTRAP_COMMAND_DESCRIPTION = `
Compile mapping.json into style object, optionally merging it with another mapping
https://akveo.github.io/react-native-ui-kitten/docs/guides/improving-performance
`;
const BOOTSTRAP_COMMAND_USAGE = `

- To compile the only Eva package:
ui-kitten bootstrap @eva-design/eva

- To compile Eva package by merging it with another mapping:
ui-kitten bootstrap @eva-design/eva ./path-to/mapping.json
`;
exports.default = (program) => {
    program.command('bootstrap <evaPackage> [mappingPath]')
        .description(BOOTSTRAP_COMMAND_DESCRIPTION)
        .usage(BOOTSTRAP_COMMAND_USAGE)
        .action((evaPackage, customMappingPath) => bootstrap_service_1.default.run({ evaPackage, customMappingPath }));
};
//# sourceMappingURL=bootstrap.js.map