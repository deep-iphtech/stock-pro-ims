import { z } from "zod";
export const positiveInt = z.number().int().min(1);
export const warehouseIdSchema = z.object({
    warehouseId: z.coerce.number().min(1),
});
export const productIdSchema = z.object({
    productId: z.coerce.number().min(1),
});
export const orderIdSchema = z.object({
    id: positiveInt,
});
export const productAndWarehouseSchema = z.object({
    warehouseId: z.coerce.number().min(1),
    productId: z.coerce.number().min(1),
});
