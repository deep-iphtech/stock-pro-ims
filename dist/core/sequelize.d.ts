import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import type { AutoPoolConnectionConfig, CreateAutoPoolOptions } from "./types.js";
export declare function createSequelize(options?: CreateAutoPoolOptions): Sequelize<PostgresDialect>;
export declare function createSequelizeFromConfig(config: AutoPoolConnectionConfig): Sequelize<PostgresDialect>;
//# sourceMappingURL=sequelize.d.ts.map