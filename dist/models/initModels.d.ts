import type { Model, ModelStatic, Sequelize, SyncOptions } from "@sequelize/core";
import { Inventory } from "./Inventory.js";
import { Orders } from "./Orders.js";
import { OrderItems } from "./OrderItems.js";
import { Warehouse } from "./Warehouse.js";
export declare const autoPoolModels: {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    Orders: typeof Orders;
    OrderItems: typeof OrderItems;
};
export declare function initializeAutoPoolData(sequelize: Sequelize, productModel?: ModelStatic<Model>): {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    Orders: typeof Orders;
    OrderItems: typeof OrderItems;
    sequelize: Sequelize<import("@sequelize/core").AbstractDialect<object, object>>;
};
export declare function syncAutoPoolData(options?: boolean | SyncOptions): Promise<void>;
//# sourceMappingURL=initModels.d.ts.map