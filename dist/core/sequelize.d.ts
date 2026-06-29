import type { AutoPoolConnectionConfig, CreateAutoPoolOptions } from "./types.js";
import { Sequelize } from "sequelize";
export declare function createSequelize(options?: CreateAutoPoolOptions): Sequelize;
export declare function createSequelizeFromConfig(config: AutoPoolConnectionConfig): Sequelize;
//# sourceMappingURL=sequelize.d.ts.map