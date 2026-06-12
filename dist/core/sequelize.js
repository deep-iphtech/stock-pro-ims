import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { loadConfig } from "./config.js";
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
        dialect: PostgresDialect,
        database: config.database,
        user: config.user ?? config.username,
        password: config.password ?? undefined,
        host: config.host,
        port: config.port,
        logging: resolveLogging(config.logging),
        pool: config.pool,
    });
}
