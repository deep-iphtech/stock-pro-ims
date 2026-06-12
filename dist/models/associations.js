import { Inventory } from "./Inventory.js";
import { PurchaseOrder } from "./PurchaseOrder.js";
import { PurchaseOrderItem } from "./PurchaseOrderItem.js";
import { SalesOrder } from "./SalesOrder.js";
import { SalesOrderItem } from "./SalesOrderItem.js";
import { SalesOrderItemAllocation } from "./SalesOrderItemAllocation.js";
import { Warehouse } from "./Warehouse.js";
export function hasProductAssociation(model) {
    return Boolean(model.associations?.product);
}
export function setupAssociations(productModel) {
    if (productModel) {
        PurchaseOrderItem.belongsTo(productModel, {
            foreignKey: "product_id",
            as: "product",
        });
        productModel.hasMany(PurchaseOrderItem, {
            foreignKey: "product_id",
            as: "purchaseOrderItems",
        });
        SalesOrderItem.belongsTo(productModel, {
            foreignKey: "product_id",
            as: "product",
        });
        productModel.hasMany(SalesOrderItem, {
            foreignKey: "product_id",
            as: "salesOrderItems",
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
    // PurchaseOrder ↔ PurchaseOrderItem
    PurchaseOrder.hasMany(PurchaseOrderItem, {
        foreignKey: "purchase_order_id",
        as: "items",
    });
    PurchaseOrderItem.belongsTo(PurchaseOrder, {
        foreignKey: "purchase_order_id",
        as: "purchaseOrder",
    });
    // Warehouse ↔ PurchaseOrderItem
    Warehouse.hasMany(PurchaseOrderItem, {
        foreignKey: "warehouse_id",
        as: "purchaseOrderItems",
    });
    PurchaseOrderItem.belongsTo(Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
    });
    // SalesOrder ↔ SalesOrderItem
    SalesOrder.hasMany(SalesOrderItem, {
        foreignKey: "sales_order_id",
        as: "items",
    });
    SalesOrderItem.belongsTo(SalesOrder, {
        foreignKey: "sales_order_id",
        as: "salesOrder",
    });
    // SalesOrderItem ↔ Allocation
    SalesOrderItem.hasMany(SalesOrderItemAllocation, {
        foreignKey: "sales_order_item_id",
        as: "allocations",
    });
    SalesOrderItemAllocation.belongsTo(SalesOrderItem, {
        foreignKey: "sales_order_item_id",
        as: "salesOrderItem",
    });
    // Warehouse ↔ Allocation
    Warehouse.hasMany(SalesOrderItemAllocation, {
        foreignKey: "warehouse_id",
        as: "allocations",
    });
    SalesOrderItemAllocation.belongsTo(Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
    });
}
