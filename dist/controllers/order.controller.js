import { Op } from "sequelize";
import { Orders } from "../models/Orders.js";
export async function createOrder(db, payload) {
    const { products, ...orderInfo } = payload;
    return db.sequelize.transaction(async (transaction) => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        // Check whether any product with the same quantity was ordered
        // by the same customer in the last 5 days.
        const duplicateItem = await db.OrderItems.findOne({
            where: {
                product_id: {
                    [Op.in]: products.map((item) => item.product_id),
                },
                quantity: {
                    [Op.in]: products.map((item) => item.quantity),
                },
            },
            include: [
                {
                    model: Orders,
                    as: "order", // change this to your actual association alias
                    required: true,
                    where: {
                        customer_id: orderInfo.customer_id,
                        created_at: {
                            [Op.gte]: fiveDaysAgo,
                        },
                    },
                },
            ],
            transaction,
        });
        if (duplicateItem) {
            return {
                success: false,
                message: `Seems Duplicate order. Product with product_id ${duplicateItem.product_id} having quantity ${duplicateItem.quantity} was already ordered by you (same customer) on ${duplicateItem.created_at}.`,
                order_id: null,
                order_number: null,
                created_at: null,
            };
        }
        const order = await Orders.create({
            order_number: `ORD-${Date.now()}${orderInfo.customer_id}`,
            ...orderInfo,
        }, { transaction });
        await db.OrderItems.bulkCreate(products.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            warehouse_id: item.warehouse_id,
            quantity_allocation: item.quantity_allocation,
        })), { transaction });
        return {
            success: true,
            order_id: order.id,
            order_number: order.order_number,
            created_at: order.created_at,
        };
    });
}
