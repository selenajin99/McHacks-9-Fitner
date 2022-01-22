export default class ProjectService {
    static resolvePath: (path: string) => string;
    static requireModule: <T = {}>(path: string) => T;
    static requireActualModule: (relativePath: string) => string;
    static hasModule: (path: string) => boolean;
}
