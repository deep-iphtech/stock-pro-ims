import { z } from "zod";
export const fetchOrderByTypeSchema = z.object({
    order_type: z.enum(["sales", "purchase"]),
});
