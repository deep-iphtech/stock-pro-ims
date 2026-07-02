import type { AutoPoolConnectionConfig } from "./types.js";
export type DBConfig = AutoPoolConnectionConfig;
export type LoadConfigOptions = {
    env?: string;
    configPath?: string;
};
export declare function loadConfig(options?: LoadConfigOptions): DBConfig;
