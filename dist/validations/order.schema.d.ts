import { z } from "zod";
export declare const customerIdSchema: z.ZodObject<{
    customer_id: z.ZodNumber;
}, z.core.$strip>;
export declare const fetchOrderByTypeSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
    customer_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const fetchOpenPurchaseOrderSchema: z.ZodObject<{
    qty: z.ZodNumber;
    product_id: z.ZodNumber;
}, z.core.$strict>;
export declare const updateOrderInfoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        0: "0";
        1: "1";
        2: "2";
        3: "3";
        4: "4";
        5: "5";
        6: "6";
        7: "7";
    }>>>;
    shipment_tracking_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    order_meta: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, z.core.$strip>>>;
}, z.core.$loose>;
export declare const PurchaseOrderCreateItemBody: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    product_id: z.ZodNumber;
    quantity: z.ZodNumber;
    price: z.ZodDefault<z.ZodNumber>;
    warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export declare const updateOrderItem: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    quantity: z.ZodOptional<z.ZodNumber>;
    price: z.ZodDefault<z.ZodNumber>;
    warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export declare const crudOnOrderItems: z.ZodObject<{
    remove_items: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    update_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        quantity: z.ZodOptional<z.ZodNumber>;
        price: z.ZodDefault<z.ZodNumber>;
        warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
export declare const createOrderValidationSchema: z.ZodObject<{
    order_type: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
    customer_id: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<{
        0: "0";
        1: "1";
        2: "2";
        3: "3";
        4: "4";
        5: "5";
        6: "6";
        7: "7";
    }>>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        product_id: z.ZodNumber;
        quantity: z.ZodNumber;
        price: z.ZodDefault<z.ZodNumber>;
        warehouse_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity_allocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>>;
}, z.core.$loose>;
