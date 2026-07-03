import { z } from "zod";
export declare const fetchOrderByTypeSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
    customer_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateOrderInfoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        draft: "draft";
        pending: "pending";
        cancelled: "cancelled";
        completed: "completed";
        ready_to_ship: "ready_to_ship";
        shipped: "shipped";
    }>>>;
    shipment_tracking_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    order_meta: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>>;
}, z.core.$loose>;
export declare const PurchaseOrderCreateItemBody: z.ZodObject<{
    product_id: z.ZodNumber;
    quantity: z.ZodNumber;
    price: z.ZodDefault<z.ZodNumber>;
    warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export declare const createOrderValidationSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
    customer_id: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        pending: "pending";
        cancelled: "cancelled";
        completed: "completed";
        ready_to_ship: "ready_to_ship";
        shipped: "shipped";
    }>>;
    products: z.ZodArray<z.ZodObject<{
        product_id: z.ZodNumber;
        quantity: z.ZodNumber;
        price: z.ZodDefault<z.ZodNumber>;
        warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>>;
}, z.core.$loose>;
