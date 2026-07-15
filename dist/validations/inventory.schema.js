import { z } from "zod";
export const inventoryCuSchema = z
    .object({
    product_id: z.number().int().min(1),
    warehouse_id: z.number().int().min(1).nullable().optional(),
    available_qty: z.number().int().min(0).optional(),
    reserved_qty: z.number().int().min(0).optional(),
})
    .strict();
export const adjustStockSchema = z.object({
    warehouseId: z.coerce.number().min(1),
    productId: z.coerce.number().min(1),
    quantity: z.coerce.number().min(0),
});
