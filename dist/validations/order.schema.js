import { z } from "zod";
import { positiveInt } from "./common.schema.js";
export const fetchOrderByTypeSchema = z.object({
    order_type: z.enum(["sales", "purchase"]),
});
export const updateOrderInfoSchema = z
    .object({
    status: z.enum(["draft", "pending"]).nullable().optional(),
    shipment_tracking_number: z.string().nullable().optional(),
    order_meta: z.object().nullable().optional(),
})
    .loose();
export const PurchaseOrderCreateItemBody = z
    .object({
    product_id: positiveInt,
    quantity: positiveInt,
    price: z.number().default(0),
    warehouse_id: positiveInt.nullable().optional(),
    quantity_allocation: z
        .string()
        .refine((value) => value.split(",").every((item) => /^\d+:\d+$/.test(item)), {
        message: "Invalid format. Expected id:count,id:count",
    })
        .nullable()
        .optional(),
})
    .loose();
export const createOrderValidationSchema = z
    .object({
    order_type: z.enum(["sales", "purchase"]),
    customer_id: positiveInt,
    status: z
        .enum(["draft", "pending", "approved", "received", "cancelled"])
        .optional(),
    products: z.array(PurchaseOrderCreateItemBody).min(1),
})
    .loose();
