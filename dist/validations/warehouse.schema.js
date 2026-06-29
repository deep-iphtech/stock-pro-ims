import { z } from "zod";
export const warehouseCUSchema = z
    .object({
    name: z.string(),
})
    .strict();
