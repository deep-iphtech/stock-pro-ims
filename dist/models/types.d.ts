import { Sequelize } from "@sequelize/core";
export interface DB {
    sequelize: Sequelize;
    productsTable?: string;
    Warehouse: typeof import("./Warehouse.js").Warehouse;
    Inventory: typeof import("./Inventory.js").Inventory;
    PurchaseOrder: typeof import("./PurchaseOrder.js").PurchaseOrder;
    PurchaseOrderItem: typeof import("./PurchaseOrderItem.js").PurchaseOrderItem;
    SalesOrder: typeof import("./SalesOrder.js").SalesOrder;
    SalesOrderItem: typeof import("./SalesOrderItem.js").SalesOrderItem;
    SalesOrderItemAllocation: typeof import("./SalesOrderItemAllocation.js").SalesOrderItemAllocation;
}
//# sourceMappingURL=types.d.ts.map