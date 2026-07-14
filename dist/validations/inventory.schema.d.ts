import { z } from "zod";
export declare const inventoryCuSchema: z.ZodObject<{
    product_id: z.ZodNumber;
    warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    available_qty: z.ZodOptional<z.ZodNumber>;
    reserved_qty: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const adjustStockSchema: z.ZodObject<{
    warehouseId: z.ZodCoercedNumber<unknown>;
    productId: z.ZodCoercedNumber<unknown>;
    quantity: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
