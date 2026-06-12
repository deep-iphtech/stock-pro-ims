import { Inventory } from "./Inventory.js";
import { PurchaseOrder } from "./PurchaseOrder.js";
import { PurchaseOrderItem } from "./PurchaseOrderItem.js";
import { SalesOrder } from "./SalesOrder.js";
import { SalesOrderItem } from "./SalesOrderItem.js";
import { SalesOrderItemAllocation } from "./SalesOrderItemAllocation.js";
import { Warehouse } from "./Warehouse.js";
import { setupAssociations } from "./associations.js";
const modelsToSync = [
    Warehouse,
    Inventory,
    PurchaseOrder,
    PurchaseOrderItem,
    SalesOrder,
    SalesOrderItem,
    SalesOrderItemAllocation,
];
export const autoPoolModels = {
    Warehouse,
    Inventory,
    PurchaseOrder,
    PurchaseOrderItem,
    SalesOrder,
    SalesOrderItem,
    SalesOrderItemAllocation,
};
let initializedFor;
export function initializeAutoPoolData(sequelize, productModel) {
    if (initializedFor === sequelize) {
        return {
            sequelize,
            ...autoPoolModels,
        };
    }
    for (const model of modelsToSync) {
        model.initModel(sequelize);
    }
    setupAssociations(productModel);
    initializedFor = sequelize;
    return {
        sequelize,
        ...autoPoolModels,
    };
}
export async function syncAutoPoolData(options = false) {
    if (!options) {
        return;
    }
    const syncOptions = options === true ? {} : options;
    for (const model of modelsToSync) {
        await model.sync(syncOptions);
    }
}
