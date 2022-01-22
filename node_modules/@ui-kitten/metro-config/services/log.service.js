"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const SEPARATOR = '\n';
class LogService {
}
exports.default = LogService;
LogService.log = (...messages) => {
    // tslint:disable-next-line:no-console
    console.log(`${LogService.formatMessages(messages)}`);
};
LogService.debug = (...messages) => {
    // tslint:disable-next-line:no-console
    console.log(`${chalk_1.default.gray.bold('debug')} ${LogService.formatMessages(messages)}`);
};
LogService.success = (...messages) => {
    // tslint:disable-next-line:no-console
    console.log(`${chalk_1.default.green.bold('success')} ${LogService.formatMessages(messages)}`);
};
LogService.info = (...messages) => {
    // tslint:disable-next-line:no-console
    console.log(`${chalk_1.default.cyan.bold('info')} ${LogService.formatMessages(messages)}`);
};
LogService.warn = (...messages) => {
    console.warn(`${chalk_1.default.yellow.bold('warn')} ${LogService.formatMessages(messages)}`);
};
LogService.error = (...messages) => {
    console.error(`${chalk_1.default.red.bold('error')} ${LogService.formatMessages(messages)}`);
};
LogService.formatMessages = (messages) => {
    return chalk_1.default.reset(messages.join(SEPARATOR));
};
//# sourceMappingURL=log.service.js.map