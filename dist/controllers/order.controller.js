import { Orders } from "../models/Orders.js";
export async function createPurchaseOrderWithItems(db, payload) {
    const { products, ...orderInfo } = payload;
    return db.sequelize.transaction(async (transaction) => {
        const order = await Orders.create({
            order_number: `ORD-${orderInfo.order_type.toUpperCase()}-${Date.now()}${orderInfo.customer_id}`,
            ...orderInfo,
        }, { transaction });
        await db.OrderItems.bulkCreate(products.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            warehouse_id: item.warehouse_id,
        })), { transaction });
        return {
            success: true,
            order_id: order.id,
            order_number: order.order_number,
            created_at: order.created_at,
        };
    });
}
