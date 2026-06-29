import { Inventory } from "./Inventory.js";
import { Warehouse } from "./Warehouse.js";
import { Orders } from "./Orders.js";
import { OrderItems } from "./OrderItems.js";
import { ModelStatic, Sequelize, SyncOptions } from "sequelize";
export declare const autoPoolModels: {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    Orders: typeof Orders;
    OrderItems: typeof OrderItems;
};
export declare function initializeAutoPoolData(sequelize: Sequelize, externalModels?: Record<string, ModelStatic<any> | undefined>): {
    Warehouse: typeof Warehouse;
    Inventory: typeof Inventory;
    Orders: typeof Orders;
    OrderItems: typeof OrderItems;
    sequelize: Sequelize;
};
export declare function syncAutoPoolData(options?: boolean | SyncOptions): Promise<void>;
//# sourceMappingURL=initModels.d.ts.map