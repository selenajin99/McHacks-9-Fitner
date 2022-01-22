export default class LogService {
    static log: (...messages: string[]) => void;
    static debug: (...messages: string[]) => void;
    static success: (...messages: string[]) => void;
    static info: (...messages: string[]) => void;
    static warn: (...messages: string[]) => void;
    static error: (...messages: string[]) => void;
    private static formatMessages;
}
