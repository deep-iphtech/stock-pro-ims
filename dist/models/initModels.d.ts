import type { Model, ModelStatic, Sequelize, SyncOptions } from "@sequelize/core";
import { Inventory } from "./Inventory.js";
import { PurchaseOrder } from "./PurchaseOrder.js";
import { PurchaseOrderItem } from "./PurchaseOrderItem.js";
import { SalesOrder } from "./SalesOrder.js";
import { SalesOrderItem } from "./SalesOrderItem.js";
import { SalesOrderItemAllocation } from "./SalesOrderItemAllocation.js";
import { Warehouse } from "./Warehouse.js";
export declare const autoPoolModels: {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    PurchaseOrder: typeof PurchaseOrder;
    PurchaseOrderItem: typeof PurchaseOrderItem;
    SalesOrder: typeof SalesOrder;
    SalesOrderItem: typeof SalesOrderItem;
    SalesOrderItemAllocation: typeof SalesOrderItemAllocation;
};
export declare function initializeAutoPoolData(sequelize: Sequelize, productModel?: ModelStatic<Model>): {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    PurchaseOrder: typeof PurchaseOrder;
    PurchaseOrderItem: typeof PurchaseOrderItem;
    SalesOrder: typeof SalesOrder;
    SalesOrderItem: typeof SalesOrderItem;
    SalesOrderItemAllocation: typeof SalesOrderItemAllocation;
    sequelize: Sequelize<import("@sequelize/core").AbstractDialect<object, object>>;
};
export declare function syncAutoPoolData(options?: boolean | SyncOptions): Promise<void>;
//# sourceMappingURL=initModels.d.ts.map