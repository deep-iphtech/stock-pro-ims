import { z } from "zod";
export declare const fetchOrderByTypeSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
}, z.core.$strip>;
export declare const updateOrderInfoSchema: z.ZodObject<{
    shipment_tracking_number: z.ZodString;
    order_meta: z.ZodObject<{}, z.core.$strip>;
}, z.core.$loose>;
//# sourceMappingURL=order.schema.d.ts.map