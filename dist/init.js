import { createSequelize } from "./core/sequelize.js";
import { initializeAutoPoolData, syncAutoPoolData, } from "./models/initModels.js";
export async function createAutoPool(options = {}) {
    const sequelize = options.sequelize ?? createSequelize(options);
    const productsTable = options.productsTable ?? "products";
    const tables = await sequelize.queryInterface.listTables();
    const hasProductsTable = tables.some((table) => (typeof table === "string" ? table : table.tableName).toLowerCase() ===
        (options.productsTable ?? "products"));
    if (!hasProductsTable) {
        throw new Error("Products table not found. Auto Pool tables cannot be created.");
    }
    const db = {
        ...initializeAutoPoolData(sequelize, options.productModel),
        productsTable,
    };
    if (options.authenticate ?? true) {
        await sequelize.authenticate();
    }
    await syncAutoPoolData(options.sync);
    return db;
}
export { initializeAutoPoolData, syncAutoPoolData };
