import { z } from "zod";
export declare const fetchOrderByTypeSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=order.schema.d.ts.map