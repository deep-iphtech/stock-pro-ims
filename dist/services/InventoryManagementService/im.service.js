import { Orders } from "../../models/Orders.js";
import { Inventory } from "../../models/Inventory.js";
import { literal, Op } from "sequelize";
export class InventoryManagementService {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async updateInventory(productId, qtyAllocation, orderType, operation, transaction) {
        const allocations = this.parseAllocations(qtyAllocation);
        const inventories = await Inventory.findAll({
            where: {
                product_id: productId,
                warehouse_id: {
                    [Op.in]: allocations.map((a) => a.warehouseId),
                },
            },
            transaction,
            lock: transaction?.LOCK?.UPDATE,
        });
        const inventoryMap = new Map(inventories.map((inventory) => [inventory.warehouse_id, inventory]));
        for (const allocation of allocations) {
            await this.processAllocation(allocation, inventoryMap, orderType, operation, transaction);
        }
    }
    parseAllocations(qtyAllocation) {
        return qtyAllocation.split(",").map((item) => {
            const [warehouseId, qty] = item.split(":");
            return {
                warehouseId: Number(warehouseId),
                qty: Number(qty),
            };
        });
    }
    async processAllocation(allocation, inventoryMap, orderType, operation, transaction) {
        const inventory = inventoryMap.get(allocation.warehouseId);
        if (!inventory) {
            throw new Error(`Inventory not found for warehouse ${allocation.warehouseId}`);
        }
        this.validateStock(inventory, allocation, orderType, operation);
        const updateData = orderType === "sales"
            ? this.getSalesUpdate(allocation.qty, operation)
            : this.getPurchaseUpdate(allocation.qty, operation);
        await inventory.update(updateData, { transaction });
    }
    validateStock(inventory, allocation, orderType, operation) {
        if (orderType !== "sales" ||
            operation !== "+" ||
            inventory.available_qty >= allocation.qty) {
            return;
        }
        throw new Error(`Insufficient stock in warehouse ${allocation.warehouseId}. Available: ${inventory.available_qty}, Required: ${allocation.qty}`);
    }
    getSalesUpdate(qty, operation) {
        return operation === "+"
            ? {
                available_qty: literal(`available_qty + ${qty}`),
                reserved_qty: literal(`reserved_qty - ${qty}`),
            }
            : {
                available_qty: literal(`available_qty - ${qty}`),
                reserved_qty: literal(`reserved_qty + ${qty}`),
            };
    }
    getPurchaseUpdate(qty, operation) {
        return {
            purchase_qty: operation === "+"
                ? literal(`purchase_qty + ${qty}`)
                : literal(`purchase_qty - ${qty}`),
        };
    }
    async reduceInventory(productId, qtyAllocation, transaction) {
        const allocations = qtyAllocation.split(",");
        // for (const allocation of allocations) {
        //   const [warehouseId, qty] = allocation.split(":");
        //   await Inventory.decrement("available_qty", {
        //     by: Number(qty),
        //     where: {
        //       product_id: productId,
        //       warehouse_id: Number(warehouseId),
        //     },
        //     transaction,
        //   });
        // }
        for (const allocation of allocations) {
            const [warehouseId, qty] = allocation.split(":");
            const requiredQty = Number(qty);
            const inventory = await Inventory.findOne({
                where: {
                    product_id: productId,
                    warehouse_id: Number(warehouseId),
                },
                transaction,
                lock: transaction.LOCK.UPDATE, // prevents concurrent updates
            });
            if (!inventory) {
                throw new Error(`Inventory not found for warehouse ${warehouseId}`);
            }
            if (inventory.available_qty < requiredQty) {
                throw new Error(`Insufficient stock in warehouse ${warehouseId}. Available: ${inventory.available_qty}, Required: ${requiredQty}`);
            }
            await inventory.decrement("available_qty", {
                by: requiredQty,
                transaction,
            });
            await inventory.increment("reserved_qty", {
                by: requiredQty,
                transaction,
            });
        }
    }
    async receivePurchaseOrderInternal(purchaseOrderId, transaction) {
        const purchaseOrder = await Orders.findByPk(purchaseOrderId, {
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
                    available_qty: 0,
                    reserved_qty: 0,
                }, { transaction });
            }
            inventory.available_qty += item.quantity;
            await inventory.save({ transaction });
        }
        purchaseOrder.status = "received";
        await purchaseOrder.save({ transaction });
        return purchaseOrder;
    }
    async allocateSalesOrderInternal(salesOrderId, transaction) {
        const order = await Orders.findByPk(salesOrderId, {
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
            if (inventory.available_qty < item.quantity) {
                throw new Error(`Insufficient inventory for product ${item.product_id}`);
            }
            inventory.available_qty -= item.quantity;
            inventory.reserved_qty += item.quantity;
            await inventory.save({ transaction });
        }
        order.status = "confirmed";
        await order.save({ transaction });
        return order;
    }
    async shipSalesOrderInternal(salesOrderId, transaction) {
        const order = await Orders.findByPk(salesOrderId, {
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
                inventory.reserved_qty -= allocation.quantity;
                await inventory.save({ transaction });
            }
        }
        order.status = "shipped";
        await order.save({ transaction });
        return order;
    }
    async cancelSalesOrderInternal(salesOrderId, transaction) {
        const order = await Orders.findByPk(salesOrderId, {
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
                inventory.available_qty += allocation.quantity;
                inventory.reserved_qty -= allocation.quantity;
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
        if (source.available_qty < quantity) {
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
                available_qty: 0,
                reserved_qty: 0,
            }, { transaction });
        }
        source.available_qty -= quantity;
        target.available_qty += quantity;
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
