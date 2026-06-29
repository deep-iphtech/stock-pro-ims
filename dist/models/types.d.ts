import { Sequelize } from "sequelize";
export interface DB {
    sequelize: Sequelize;
    productsTable?: string;
    status: {
        productsTableExists: boolean;
    };
    Warehouse: typeof import("./Warehouse.js").Warehouse;
    Inventory: typeof import("./Inventory.js").Inventory;
    Orders: typeof import("./Orders.js").Orders;
    OrderItems: typeof import("./OrderItems.js").OrderItems;
}
//# sourceMappingURL=types.d.ts.map