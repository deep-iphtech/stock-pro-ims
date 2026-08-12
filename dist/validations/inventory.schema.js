import { z } from "zod";
export const adjustStockSchema = z
    .object({
    product_id: z.number().min(1),
    inv: z.array(z.object({
        warehouse_id: z.number().min(1),
        available_qty: z.number(),
        reserved_qty: z.number().min(0).optional(),
    })),
})
    .strict();
