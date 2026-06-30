import fs from "fs";
import path from "path";
import { createRequire } from "module";
const DEFAULT_CONFIG_PATH = path.join("config", "config.json");
const requireModule = createRequire(import.meta.url);
function normalizeModuleExport(value) {
    if (!value || typeof value !== "object" || !("default" in value)) {
        return value;
    }
    const moduleValue = value;
    const hasOnlyDefaultExport = Object.keys(moduleValue).length === 1 && moduleValue.default !== undefined;
    if (moduleValue.__esModule || hasOnlyDefaultExport) {
        return moduleValue.default;
    }
    return value;
}
function loadTsxRequire() {
    try {
        const tsx = requireModule("tsx/cjs/api");
        return tsx.require;
    }
    catch {
        return undefined;
    }
}
function loadConfigFile(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === ".json") {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    try {
        return normalizeModuleExport(requireModule(filePath));
    }
    catch (requireError) {
        const tsxRequire = loadTsxRequire();
        if (tsxRequire) {
            try {
                return normalizeModuleExport(tsxRequire(filePath, import.meta.url));
            }
            catch (tsxError) {
                throw tsxError instanceof Error
                    ? tsxError
                    : new Error(`Failed to load config file ${filePath}: ${String(tsxError)}`);
            }
        }
        throw requireError instanceof Error
            ? requireError
            : new Error(`Failed to load config file ${filePath}: ${String(requireError)}`);
    }
}
function resolveConfigPath(configPath) {
    if (configPath) {
        return path.resolve(process.cwd(), configPath);
    }
    const defaultConfigPath = path.resolve(process.cwd(), DEFAULT_CONFIG_PATH);
    if (fs.existsSync(defaultConfigPath)) {
        return defaultConfigPath;
    }
    const sequelizeRcPath = path.resolve(process.cwd(), ".sequelizerc");
    if (!fs.existsSync(sequelizeRcPath)) {
        return defaultConfigPath;
    }
    const sequelizeRc = loadConfigFile(sequelizeRcPath);
    const rcConfigPath = sequelizeRc.config;
    if (!rcConfigPath) {
        return defaultConfigPath;
    }
    return path.isAbsolute(rcConfigPath)
        ? rcConfigPath
        : path.resolve(process.cwd(), rcConfigPath);
}
export function loadConfig(options = {}) {
    const configPath = resolveConfigPath(options.configPath);
    if (!fs.existsSync(configPath)) {
        throw new Error(`${configPath} not found`);
    }
    const config = loadConfigFile(configPath);
    const env = options.env ?? process.env.NODE_ENV ?? "development";
    const envConfig = config[env];
    if (!envConfig) {
        throw new Error(`Database config for environment "${env}" not found in ${configPath}`);
    }
    return envConfig;
}
