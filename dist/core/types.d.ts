import type { Model, ModelStatic, Sequelize, SyncOptions } from "@sequelize/core";
import type { DB } from "../models/types.js";
export type AutoPoolEnvironment = string;
export type SupportedConfigDialect = "postgres";
export interface AutoPoolConnectionConfig {
    dialect: SupportedConfigDialect;
    database?: string;
    username?: string;
    user?: string;
    password?: string | null;
    host?: string;
    port?: number;
    logging?: boolean;
    pool?: Record<string, unknown>;
}
export interface CreateAutoPoolOptions {
    env?: AutoPoolEnvironment;
    configPath?: string;
    sequelize?: Sequelize;
    sync?: boolean | SyncOptions;
    authenticate?: boolean;
    productsTable?: string;
    productModel?: ModelStatic<Model>;
    onlyTables?: string[];
    models?: ExternalModels;
}
export type AutoPoolDB = DB;
export interface AutoPoolModels {
    Warehouse: DB["Warehouse"];
    Inventory: DB["Inventory"];
    Orders: DB["Orders"];
    OrderItems: DB["OrderItems"];
}
export interface ExternalModels {
    customer?: any;
    product?: any;
    [key: string]: any;
}
//# sourceMappingURL=types.d.ts.map