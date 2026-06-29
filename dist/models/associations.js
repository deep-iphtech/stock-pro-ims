import { Inventory } from "./Inventory.js";
import { Orders } from "./Orders.js";
import { OrderItems } from "./OrderItems.js";
import { Warehouse } from "./Warehouse.js";
export function hasProductAssociation(model) {
    return Boolean(model.associations?.product);
}
export function setupAssociations(models = {}) {
    const { customer, product } = models;
    if (customer) {
        Orders.belongsTo(customer, {
            foreignKey: "customer_id",
            as: "customer",
        });
    }
    if (product) {
        Orders.hasMany(OrderItems, {
            foreignKey: "order_id",
            as: "products",
        });
        OrderItems.belongsTo(product, {
            foreignKey: "product_id",
            as: "product",
        });
        product.hasMany(OrderItems, {
            foreignKey: "product_id",
            as: "orderItems",
        });
        Inventory.belongsTo(product, {
            foreignKey: "product_id",
            as: "product",
        });
        product.hasMany(Inventory, {
            foreignKey: "product_id",
            as: "inventories",
        });
    }
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
    Warehouse.hasMany(OrderItems, {
        foreignKey: "warehouse_id",
        as: "purchaseOrderItems",
    });
    OrderItems.belongsTo(Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
    });
}
