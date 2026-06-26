import { Inventory } from "./Inventory.js";
import { Orders } from "./Orders.js";
import { OrderItems } from "./OrderItems.js";
import { Warehouse } from "./Warehouse.js";
export function hasProductAssociation(model) {
    return Boolean(model.associations?.product);
}
export function setupAssociations(productModel) {
    if (productModel) {
        Orders.hasMany(OrderItems, {
            foreignKey: "order_id",
            as: "products",
        });
        OrderItems.belongsTo(productModel, {
            foreignKey: "product_id",
            as: "product",
        });
        productModel.hasMany(OrderItems, {
            foreignKey: "product_id",
            as: "orderItems",
        });
        Inventory.belongsTo(productModel, {
            foreignKey: "product_id",
            as: "product",
        });
        productModel.hasMany(Inventory, {
            foreignKey: "product_id",
            as: "inventories",
        });
    }
    // Warehouse ↔ Inventory
    Warehouse.hasMany(Inventory, {
        foreignKey: "warehouse_id",
        as: "inventory",
    });
    Inventory.belongsTo(Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
    });
    // Orders ↔ OrderItems
    Orders.hasMany(OrderItems, {
        foreignKey: "order_id",
        as: "orderItems",
    });
    // OrderItems.belongsTo(Orders, {
    //   foreignKey: "order_id",
    //   as: "o_id",
    // });
    // Warehouse ↔ OrderItems
    Warehouse.hasMany(OrderItems, {
        foreignKey: "warehouse_id",
        as: "purchaseOrderItems",
    });
    OrderItems.belongsTo(Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
    });
}
