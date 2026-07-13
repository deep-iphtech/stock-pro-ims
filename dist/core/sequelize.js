import { loadConfig } from "./config.js";
import { Sequelize } from "sequelize";
function resolveLogging(logging) {
    return logging ? console.log : false;
}
export function createSequelize(options = {}) {
    return createSequelizeFromConfig(loadConfig(options));
}
export function createSequelizeFromConfig(config) {
    if (config.dialect !== "postgres") {
        throw new Error(`Unsupported dialect "${String(config.dialect)}". stock-pro-ims config loading supports PostgreSQL only.`);
    }
    return new Sequelize({
        dialect: "postgres",
        database: config.database,
        username: config.user ?? config.username,
        password: config.password ?? undefined,
        host: config.host,
        port: config.port,
        logging: resolveLogging(config.logging),
        pool: config.pool,
    });
}
