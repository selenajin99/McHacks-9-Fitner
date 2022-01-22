"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
function registerCommands() {
    require('./bootstrap').default(commander_1.default);
}
registerCommands();
commander_1.default.parse(process.argv);
//# sourceMappingURL=index.js.map