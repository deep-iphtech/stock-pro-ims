import { z } from "zod";
export declare const warehouseCUSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
