import { z } from "zod";
export declare const adjustStockSchema: z.ZodObject<{
    product_id: z.ZodNumber;
    inv: z.ZodArray<z.ZodObject<{
        warehouse_id: z.ZodNumber;
        available_qty: z.ZodNumber;
        reserved_qty: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strict>;
