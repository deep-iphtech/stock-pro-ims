import { createSequelize } from "./core/sequelize.js";
import { initializeAutoPoolData, syncAutoPoolData, } from "./models/initModels.js";
export async function createAutoPool(options = {}) {
    const sequelize = options.sequelize ?? createSequelize(options);
    const productsTable = (options.productsTable ?? "products").toLowerCase();
    if (options.authenticate ?? true) {
        await sequelize.authenticate();
    }
    const tablesRaw = await sequelize.getQueryInterface().showAllTables();
    const tables = tablesRaw.map((t) => (typeof t === "string" ? t : t.tableName).toLowerCase());
    const hasProductsTable = tables.includes(productsTable);
    // ❗ DO NOT THROW — just report state
    //options.models
    const db = {
        ...initializeAutoPoolData(sequelize),
        sequelize,
        productsTable,
        status: {
            productsTableExists: hasProductsTable,
        },
    };
    // sync always runs if enabled
    if (options.sync) {
        await syncAutoPoolData(true);
    }
    return db;
}
export { initializeAutoPoolData, syncAutoPoolData };
