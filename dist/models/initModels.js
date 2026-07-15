import { Inventory } from "./Inventory.js";
import { Warehouse } from "./Warehouse.js";
import { Orders } from "./Orders.js";
import { OrderItems } from "./OrderItems.js";
import { setupAssociations } from "./associations.js";
const modelsToSync = [Warehouse, Inventory, Orders, OrderItems];
export const autoPoolModels = {
    Warehouse,
    Inventory,
    Orders,
    OrderItems,
};
let initializedFor;
export function initializeAutoPoolData(sequelize, externalModels = {}) {
    if (initializedFor === sequelize) {
        return {
            sequelize,
            ...autoPoolModels,
        };
    }
    for (const model of modelsToSync) {
        model.initModel(sequelize);
    }
    setupAssociations(externalModels);
    initializedFor = sequelize;
    return {
        sequelize,
        ...autoPoolModels,
    };
}
export async function syncAutoPoolData(options = false) {
    if (!options)
        return;
    const syncOptions = options === true ? {} : options;
    for (const model of modelsToSync) {
        await model.sync({ ...syncOptions, alter: true });
    }
}
