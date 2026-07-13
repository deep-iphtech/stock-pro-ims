import { z } from "zod";
import { positiveInt } from "./common.schema.js";
export const fetchOrderByTypeSchema = z.object({
    order_type: z.enum(["sales", "purchase"]),
    customer_id: z.number().optional(),
});
export const updateOrderInfoSchema = z
    .object({
    status: z
        .enum(["0", "1", "2", "3", "4", "5", "6", "7"])
        .nullable()
        .optional(),
    shipment_tracking_number: z.string().nullable().optional(),
    order_meta: z.object().nullable().optional(),
})
    .loose();
export const PurchaseOrderCreateItemBody = z
    .object({
    id: z.number().optional(),
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
export const updateOrderItem = z
    .object({
    id: z.number().optional(),
    quantity: positiveInt.optional(),
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
export const crudOnOrderItems = z
    .object({
    remove_items: z.array(z.number()).min(1).optional(),
    update_items: z.array(updateOrderItem).min(1).optional(),
})
    .loose()
    .refine(({ remove_items, update_items }) => remove_items !== undefined || update_items !== undefined, {
    message: "Invalid Payload. At least one operation is required",
});
export const createOrderValidationSchema = z
    .object({
    order_type: z.enum(["sales", "purchase"]),
    customer_id: positiveInt,
    status: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]).optional(),
    products: z.array(PurchaseOrderCreateItemBody).min(1),
})
    .loose();
