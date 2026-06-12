import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { Inventory } from "../../models/Inventory.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { SalesOrderItemAllocation } from "../../models/SalesOrderItemAllocation.js";
export class InventoryManagementService {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async receivePurchaseOrderInternal(purchaseOrderId, transaction) {
        const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId, {
            include: ["items"],
            transaction,
        });
        if (!purchaseOrder) {
            throw new Error("Purchase order not found");
        }
        if (purchaseOrder.status === "received") {
            throw new Error("Purchase order already received");
        }
        const items = purchaseOrder.items ?? [];
        for (const item of items) {
            let inventory = await Inventory.findOne({
                where: {
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id,
                },
                transaction,
            });
            if (!inventory) {
                inventory = await Inventory.create({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id,
                    available: 0,
                    reserved: 0,
                }, { transaction });
            }
            inventory.available += item.quantity;
            await inventory.save({ transaction });
        }
        purchaseOrder.status = "received";
        await purchaseOrder.save({ transaction });
        return purchaseOrder;
    }
    async allocateSalesOrderInternal(salesOrderId, transaction) {
        const order = await SalesOrder.findByPk(salesOrderId, {
            include: ["items"],
            transaction,
        });
        if (!order) {
            throw new Error("Sales order not found");
        }
        const items = order.items ?? [];
        for (const item of items) {
            const inventory = await Inventory.findOne({
                where: {
                    product_id: item.product_id,
                },
                transaction,
            });
            if (!inventory) {
                throw new Error(`No inventory for product ${item.product_id}`);
            }
            if (inventory.available < item.quantity) {
                throw new Error(`Insufficient inventory for product ${item.product_id}`);
            }
            inventory.available -= item.quantity;
            inventory.reserved += item.quantity;
            await inventory.save({ transaction });
            await SalesOrderItemAllocation.create({
                sales_order_item_id: item.id,
                warehouse_id: inventory.warehouse_id,
                quantity: item.quantity,
            }, { transaction });
        }
        order.status = "confirmed";
        await order.save({ transaction });
        return order;
    }
    async shipSalesOrderInternal(salesOrderId, transaction) {
        const order = await SalesOrder.findByPk(salesOrderId, {
            include: [
                {
                    association: "items",
                    include: ["allocations"],
                },
            ],
            transaction,
        });
        if (!order) {
            throw new Error("Sales order not found");
        }
        for (const item of order.items ?? []) {
            for (const allocation of item.allocations ?? []) {
                const inventory = await Inventory.findOne({
                    where: {
                        warehouse_id: allocation.warehouse_id,
                        product_id: item.product_id,
                    },
                    transaction,
                });
                if (!inventory) {
                    continue;
                }
                inventory.reserved -= allocation.quantity;
                await inventory.save({ transaction });
            }
        }
        order.status = "shipped";
        await order.save({ transaction });
        return order;
    }
    async cancelSalesOrderInternal(salesOrderId, transaction) {
        const order = await SalesOrder.findByPk(salesOrderId, {
            include: [
                {
                    association: "items",
                    include: ["allocations"],
                },
            ],
            transaction,
        });
        if (!order) {
            throw new Error("Sales order not found");
        }
        for (const item of order.items ?? []) {
            for (const allocation of item.allocations ?? []) {
                const inventory = await Inventory.findOne({
                    where: {
                        warehouse_id: allocation.warehouse_id,
                        product_id: item.product_id,
                    },
                    transaction,
                });
                if (!inventory) {
                    continue;
                }
                inventory.available += allocation.quantity;
                inventory.reserved -= allocation.quantity;
                await inventory.save({ transaction });
            }
        }
        order.status = "cancelled";
        await order.save({ transaction });
        return order;
    }
    async transferStockInternal(productId, sourceWarehouseId, targetWarehouseId, quantity, transaction) {
        const source = await Inventory.findOne({
            where: {
                product_id: productId,
                warehouse_id: sourceWarehouseId,
            },
            transaction,
        });
        if (!source) {
            throw new Error("Source inventory not found");
        }
        if (source.available < quantity) {
            throw new Error("Insufficient stock");
        }
        let target = await Inventory.findOne({
            where: {
                product_id: productId,
                warehouse_id: targetWarehouseId,
            },
            transaction,
        });
        if (!target) {
            target = await Inventory.create({
                product_id: productId,
                warehouse_id: targetWarehouseId,
                available: 0,
                reserved: 0,
            }, { transaction });
        }
        source.available -= quantity;
        target.available += quantity;
        await source.save({ transaction });
        await target.save({ transaction });
        return {
            source,
            target,
        };
    }
    async receivePurchaseOrder(purchaseOrderId) {
        return this.sequelize.transaction(async (transaction) => {
            return this.receivePurchaseOrderInternal(purchaseOrderId, transaction);
        });
    }
    async allocateSalesOrder(salesOrderId) {
        return this.sequelize.transaction((transaction) => this.allocateSalesOrderInternal(salesOrderId, transaction));
    }
    async shipSalesOrder(salesOrderId) {
        return this.sequelize.transaction((transaction) => this.shipSalesOrderInternal(salesOrderId, transaction));
    }
    async cancelSalesOrder(salesOrderId) {
        return this.sequelize.transaction((transaction) => this.cancelSalesOrderInternal(salesOrderId, transaction));
    }
    async transferStock(productId, sourceWarehouseId, targetWarehouseId, quantity) {
        return this.sequelize.transaction((transaction) => this.transferStockInternal(productId, sourceWarehouseId, targetWarehouseId, quantity, transaction));
    }
}
