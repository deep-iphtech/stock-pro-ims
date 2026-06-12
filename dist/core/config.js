import fs from "fs";
import path from "path";
import { createRequire } from "module";
const DEFAULT_CONFIG_PATH = path.join("config", "config.json");
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
    const require = createRequire(import.meta.url);
    const sequelizeRc = require(sequelizeRcPath);
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
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const env = options.env ?? process.env.NODE_ENV ?? "development";
    const envConfig = config[env];
    if (!envConfig) {
        throw new Error(`Database config for environment "${env}" not found in ${configPath}`);
    }
    return envConfig;
}
