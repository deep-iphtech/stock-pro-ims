import { z } from "zod";
export declare const positiveInt: z.ZodNumber;
export declare const warehouseIdSchema: z.ZodObject<{
    warehouseId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const productIdSchema: z.ZodObject<{
    product_id: z.ZodNumber;
}, z.core.$strip>;
export declare const orderIdSchema: z.ZodObject<{
    id: z.ZodNumber;
}, z.core.$strip>;
export declare const productAndWarehouseSchema: z.ZodObject<{
    warehouseId: z.ZodCoercedNumber<unknown>;
    productId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
