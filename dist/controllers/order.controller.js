import { Orders } from "../models/Orders.js";
import { InventoryManagementService } from "../services/InventoryManagementService/im.service.js";
export async function createPurchaseOrderWithItems(db, payload) {
    const { products, ...orderInfo } = payload;
    return db.sequelize.transaction(async (transaction) => {
        const order = await Orders.create({
            order_number: `ORD-${Date.now()}${orderInfo.customer_id}`,
            ...orderInfo,
        }, { transaction });
        const createOrderItems = await db.OrderItems.bulkCreate(products.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            warehouse_id: item.warehouse_id,
            quantity_allocation: item.quantity_allocation,
        })), { transaction });
        if (createOrderItems && payload.order_type === "sales") {
            const ims = new InventoryManagementService(db.sequelize);
            for (const item of products) {
                await ims.reduceInventory(item.product_id, item.quantity_allocation, transaction);
            }
        }
        return {
            success: true,
            order_id: order.id,
            order_number: order.order_number,
            created_at: order.created_at,
        };
    });
}
