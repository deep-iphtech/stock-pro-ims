import { z } from "zod";
export const fetchOrderByTypeSchema = z.object({
    order_type: z.enum(["sales", "purchase"]),
});
export const updateOrderInfoSchema = z
    .object({
    shipment_tracking_number: z.string(),
    order_meta: z.object(),
})
    .loose();
