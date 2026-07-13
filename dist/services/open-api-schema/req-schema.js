import { objectSchema } from "../../utils/open-api.js";
const reqSchemas = {
    Warehouse: objectSchema({
        name: {
            type: "string",
            example: "Central Warehouse",
        },
    }, ["name"], {
        name: "Central Warehouse",
    }),
    "Warehouse-update": objectSchema({
        name: {
            type: "string",
            example: "Central Warehouse",
        },
    }, ["name"], {
        name: "Central Warehouse",
    }),
    Inventory: {
        type: "object",
        properties: {
            id: { type: "integer" },
            product_id: { type: "integer" },
            warehouse_id: { type: "integer" },
            available: { type: "integer" },
            reserved: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    InventoryCreateRequest: objectSchema({
        product_id: {
            type: "integer",
            minimum: 1,
            example: 101,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
        available: {
            type: "integer",
            example: 250,
        },
        reserved: {
            type: "integer",
            example: 10,
        },
    }, ["product_id", "warehouse_id"], {
        product_id: 101,
        warehouse_id: 1,
        available: 250,
        reserved: 10,
    }),
    InventoryUpdateRequest: objectSchema({
        product_id: {
            type: "integer",
            minimum: 1,
            example: 101,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
        available: {
            type: "integer",
            example: 240,
        },
        reserved: {
            type: "integer",
            example: 12,
        },
    }, [], {
        available: 240,
        reserved: 12,
    }),
    Orders: {
        type: "object",
        properties: {
            customer_id: {
                type: "integer",
            },
            order_type: {
                type: "string",
                example: "sales",
            },
            status: {
                type: "string",
                example: "1",
            },
            notes: {
                type: "string",
            },
            payment_status: {
                type: "string",
                example: "pending",
            },
            paid_at: {
                type: "date",
            },
            order_meta: {
                type: "object",
            },
            shipping_charges: {
                type: "integer",
            },
            discount: {
                type: "integer",
            },
            products: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        product_id: {
                            type: "integer",
                        },
                        warehouse_id: {
                            type: "integer",
                        },
                        quantity: {
                            type: "integer",
                        },
                        quantity_allocation: {
                            type: "string",
                            example: "1:5",
                        },
                        price: {
                            type: "integer",
                        },
                    },
                    required: ["product_id", "quantity", "price"],
                },
            },
        },
        required: ["customer_id", "order_type", "products"],
    },
    "Orders-update": {
        type: "object",
        properties: {
            status: {
                type: "string",
            },
            shipment_tracking_number: {
                type: "string",
            },
            order_meta: {
                type: "object",
                additionalProperties: true,
            },
        },
    },
    PurchaseOrderCreateItemRequest: objectSchema({
        product_id: {
            type: "integer",
            minimum: 1,
            example: 2005,
        },
        quantity: {
            type: "integer",
            example: 50,
        },
        pricing_tier: {
            type: "string",
            enum: ["retail", "wholesale", "distributor"],
            example: "retail",
        },
        price: {
            type: "number",
            example: 0,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
    }, ["product_id", "quantity", "pricing_tier", "price", "warehouse_id"], {
        product_id: 2005,
        quantity: 50,
        pricing_tier: "retail",
        price: 0,
        warehouse_id: 1,
    }),
    PurchaseOrderCreateRequest: objectSchema({
        order_number: {
            type: "string",
            example: "PO-10001",
        },
        business_id: {
            type: "integer",
            minimum: 1,
            example: 12,
        },
        status: {
            type: "string",
            enum: ["0", "1", "2", "3", "4", "5", "6", "7"],
            example: "1",
        },
        shipping_charges: {
            type: "number",
            example: 25,
        },
        notes: {
            type: ["string", "null"],
            example: "Initial stock replenishment",
        },
        created_by: {
            type: "integer",
            minimum: 1,
            example: 3,
        },
        payment_status: {
            type: "string",
            enum: ["pending", "partial", "paid"],
            example: "pending",
        },
        paid_at: {
            type: ["string", "null"],
            format: "date-time",
            example: null,
        },
        items: {
            type: "array",
            minItems: 1,
            items: {
                $ref: "#/components/schemas/PurchaseOrderCreateItemRequest",
            },
        },
    }, ["business_id", "created_by", "items"], {
        business_id: 12,
        created_by: 3,
        items: [
            {
                product_id: 2005,
                quantity: 50,
                pricing_tier: "retail",
                price: 0,
                warehouse_id: 1,
            },
        ],
    }),
    PurchaseOrderUpdateRequest: objectSchema({
        order_number: {
            type: "string",
            example: "PO-10001",
        },
        business_id: {
            type: "integer",
            minimum: 1,
            example: 12,
        },
        status: {
            type: "string",
            enum: ["0", "1", "2", "3", "4", "5", "6", "7"],
            example: "approved",
        },
        shipping_charges: {
            type: "number",
            example: 25,
        },
        notes: {
            type: ["string", "null"],
            example: "Approved for receiving",
        },
        created_by: {
            type: "integer",
            minimum: 1,
            example: 3,
        },
        payment_status: {
            type: "string",
            enum: ["pending", "partial", "paid"],
            example: "partial",
        },
        paid_at: {
            type: ["string", "null"],
            format: "date-time",
            example: "2026-06-05T10:30:00Z",
        },
    }, [], {
        status: "approved",
        payment_status: "partial",
        paid_at: "2026-06-05T10:30:00Z",
    }),
    OrderItems: {
        type: "object",
        properties: {
            id: { type: "integer" },
            purchase_order_id: { type: "integer" },
            product_id: { type: "integer" },
            quantity: { type: "integer" },
            pricing_tier: { type: "string" },
            price: { type: "number" },
            warehouse_id: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    // PurchaseOrderItemCreateRequest: objectSchema(
    //   {
    //     purchase_order_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1001,
    //     },
    //     product_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 2005,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 50,
    //     },
    //     pricing_tier: {
    //       type: "string",
    //       enum: ["retail", "wholesale", "distributor"],
    //       example: "wholesale",
    //     },
    //     price: {
    //       type: "number",
    //       example: 12.5,
    //     },
    //     warehouse_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1,
    //     },
    //   },
    //   [
    //     "purchase_order_id",
    //     "product_id",
    //     "quantity",
    //     "pricing_tier",
    //     "price",
    //     "warehouse_id",
    //   ],
    //   {
    //     purchase_order_id: 1001,
    //     product_id: 2005,
    //     quantity: 50,
    //     pricing_tier: "wholesale",
    //     price: 12.5,
    //     warehouse_id: 1,
    //   },
    // ),
    // PurchaseOrderItemUpdateRequest: objectSchema(
    //   {
    //     purchase_order_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1001,
    //     },
    //     product_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 2005,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 48,
    //     },
    //     pricing_tier: {
    //       type: "string",
    //       enum: ["retail", "wholesale", "distributor"],
    //       example: "wholesale",
    //     },
    //     price: {
    //       type: "number",
    //       example: 12.5,
    //     },
    //     warehouse_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1,
    //     },
    //   },
    //   [],
    //   {
    //     quantity: 48,
    //     price: 12.5,
    //   },
    // ),
    // SalesOrderCreateRequest: objectSchema(
    //   {
    //     order_number: {
    //       type: "string",
    //       example: "SO-20001",
    //     },
    //     business_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 12,
    //     },
    //     status: {
    //       type: "string",
    //       enum: [
    //         "draft",
    //         "pending",
    //         "confirmed",
    //         "processing",
    //         "shipped",
    //         "completed",
    //         "cancelled",
    //       ],
    //       example: "draft",
    //     },
    //     invoice_date: {
    //       type: "string",
    //       format: "date",
    //       example: "2026-06-05",
    //     },
    //     shipping_charges: {
    //       type: "number",
    //       example: 15,
    //     },
    //     notes: {
    //       type: ["string", "null"],
    //       example: "Deliver before end of week",
    //     },
    //     created_by: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 7,
    //     },
    //     payment_status: {
    //       type: "string",
    //       enum: ["pending", "partial", "paid"],
    //       example: "pending",
    //     },
    //     paid_at: {
    //       type: ["string", "null"],
    //       format: "date",
    //       example: null,
    //     },
    //     drop_ship_contact: {
    //       type: ["string", "null"],
    //       example: "Jane Doe",
    //     },
    //     shipping_address: {
    //       type: ["string", "null"],
    //       example: "12 Market St, Mumbai, MH 400001",
    //     },
    //   },
    //   ["order_number", "invoice_date", "created_by"],
    //   {
    //     order_number: "SO-20001",
    //     business_id: 12,
    //     status: "draft",
    //     invoice_date: "2026-06-05",
    //     shipping_charges: 15,
    //     notes: "Deliver before end of week",
    //     created_by: 7,
    //     payment_status: "pending",
    //     paid_at: null,
    //     drop_ship_contact: "Jane Doe",
    //     shipping_address: "12 Market St, Mumbai, MH 400001",
    //   },
    // ),
    // SalesOrderUpdateRequest: objectSchema(
    //   {
    //     order_number: {
    //       type: "string",
    //       example: "SO-20001",
    //     },
    //     business_id: {
    //       type: ["integer", "null"],
    //       minimum: 1,
    //       example: 12,
    //     },
    //     status: {
    //       type: "string",
    //       enum: [
    //         "draft",
    //         "pending",
    //         "confirmed",
    //         "processing",
    //         "shipped",
    //         "completed",
    //         "cancelled",
    //       ],
    //       example: "confirmed",
    //     },
    //     invoice_date: {
    //       type: "string",
    //       format: "date",
    //       example: "2026-06-05",
    //     },
    //     shipping_charges: {
    //       type: "number",
    //       example: 15,
    //     },
    //     notes: {
    //       type: ["string", "null"],
    //       example: "Customer confirmed delivery slot",
    //     },
    //     created_by: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 7,
    //     },
    //     payment_status: {
    //       type: "string",
    //       enum: ["pending", "partial", "paid"],
    //       example: "partial",
    //     },
    //     paid_at: {
    //       type: ["string", "null"],
    //       format: "date",
    //       example: "2026-06-05",
    //     },
    //     drop_ship_contact: {
    //       type: ["string", "null"],
    //       example: "Jane Doe",
    //     },
    //     shipping_address: {
    //       type: ["string", "null"],
    //       example: "12 Market St, Mumbai, MH 400001",
    //     },
    //   },
    //   [],
    //   {
    //     status: "confirmed",
    //     payment_status: "partial",
    //     notes: "Customer confirmed delivery slot",
    //   },
    // ),
    // SalesOrderItemCreateRequest: objectSchema(
    //   {
    //     sales_order_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 5001,
    //     },
    //     product_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 2005,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 10,
    //     },
    //     pricing_tier: {
    //       type: "string",
    //       enum: ["retail", "wholesale", "distributor"],
    //       example: "retail",
    //     },
    //     price: {
    //       type: "number",
    //       example: 19.99,
    //     },
    //   },
    //   ["sales_order_id", "product_id", "quantity", "pricing_tier", "price"],
    //   {
    //     sales_order_id: 5001,
    //     product_id: 2005,
    //     quantity: 10,
    //     pricing_tier: "retail",
    //     price: 19.99,
    //   },
    // ),
    // SalesOrderItemUpdateRequest: objectSchema(
    //   {
    //     sales_order_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 5001,
    //     },
    //     product_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 2005,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 12,
    //     },
    //     pricing_tier: {
    //       type: "string",
    //       enum: ["retail", "wholesale", "distributor"],
    //       example: "retail",
    //     },
    //     price: {
    //       type: "number",
    //       example: 19.99,
    //     },
    //   },
    //   [],
    //   {
    //     quantity: 12,
    //     price: 19.99,
    //   },
    // ),
    // SalesOrderItemAllocation: {
    //   type: "object",
    //   properties: {
    //     id: { type: "integer" },
    //     sales_order_item_id: { type: "integer" },
    //     warehouse_id: { type: "integer" },
    //     quantity: { type: "integer" },
    //     created_at: { type: "string", format: "date-time" },
    //     updated_at: { type: "string", format: "date-time" },
    //   },
    // },
    // SalesOrderItemAllocationCreateRequest: objectSchema(
    //   {
    //     sales_order_item_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 8001,
    //     },
    //     warehouse_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 10,
    //     },
    //   },
    //   ["sales_order_item_id", "warehouse_id", "quantity"],
    //   {
    //     sales_order_item_id: 8001,
    //     warehouse_id: 1,
    //     quantity: 10,
    //   },
    // ),
    // SalesOrderItemAllocationUpdateRequest: objectSchema(
    //   {
    //     sales_order_item_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 8001,
    //     },
    //     warehouse_id: {
    //       type: "integer",
    //       minimum: 1,
    //       example: 1,
    //     },
    //     quantity: {
    //       type: "integer",
    //       example: 10,
    //     },
    //   },
    //   [],
    //   {
    //     quantity: 10,
    //   },
    // ),
    // ErrorResponse: {
    //   type: "object",
    //   properties: {
    //     message: { type: "string" },
    //   },
    //   required: ["message"],
    // },
    // AdjustStockRequest: {
    //   type: "object",
    //   required: ["productId", "warehouseId", "quantity"],
    //   properties: {
    //     productId: { type: "integer", minimum: 1, example: 101 },
    //     warehouseId: { type: "integer", minimum: 1, example: 1 },
    //     quantity: { type: "integer", example: 25 },
    //   },
    //   example: {
    //     productId: 101,
    //     warehouseId: 1,
    //     quantity: 25,
    //   },
    // },
    // TransferStockRequest: {
    //   type: "object",
    //   required: [
    //     "productId",
    //     "sourceWarehouseId",
    //     "targetWarehouseId",
    //     "quantity",
    //   ],
    //   properties: {
    //     productId: { type: "integer", minimum: 1, example: 101 },
    //     sourceWarehouseId: { type: "integer", minimum: 1, example: 1 },
    //     targetWarehouseId: { type: "integer", minimum: 1, example: 2 },
    //     quantity: { type: "integer", example: 25 },
    //   },
    //   example: {
    //     productId: 101,
    //     sourceWarehouseId: 1,
    //     targetWarehouseId: 2,
    //     quantity: 25,
    //   },
    // },
    // Product: {
    //   type: "object",
    //   description:
    //     "Example product shape shown in Swagger. The actual product model comes from the host app or test setup and may differ.",
    //   properties: {
    //     id: { type: "integer", minimum: 1, example: 1 },
    //     name: { type: "string", example: "Sample Product" },
    //     sku: { type: "string", example: "SKU-001" },
    //     description: {
    //       type: "string",
    //       example: "Sample product used for testing",
    //     },
    //     price: { type: "number", example: 99.99 },
    //     created_at: { type: "string", format: "date-time" },
    //     updated_at: { type: "string", format: "date-time" },
    //   },
    //   required: ["id"],
    //   additionalProperties: true,
    //   example: {
    //     id: 1,
    //     name: "Sample Product",
    //     sku: "SKU-001",
    //     description: "Sample product used for testing",
    //     price: 99.99,
    //     created_at: "2026-06-09T00:00:00Z",
    //     updated_at: "2026-06-09T00:00:00Z",
    //   },
    // },
    // ProductCreateRequest: objectSchema(
    //   {
    //     name: {
    //       type: "string",
    //       example: "Sample Product",
    //     },
    //     sku: {
    //       type: "string",
    //       example: "SKU-001",
    //     },
    //     description: {
    //       type: "string",
    //       example: "Sample product used for testing",
    //     },
    //     price: {
    //       type: "number",
    //       example: 99.99,
    //     },
    //   },
    //   [],
    //   {
    //     name: "Sample Product",
    //     sku: "SKU-001",
    //     description: "Sample product used for testing",
    //     price: 99.99,
    //   },
    // ),
    // ProductUpdateRequest: objectSchema(
    //   {
    //     name: {
    //       type: "string",
    //       example: "Sample Product",
    //     },
    //     sku: {
    //       type: "string",
    //       example: "SKU-001",
    //     },
    //     description: {
    //       type: "string",
    //       example: "Sample product used for testing",
    //     },
    //     price: {
    //       type: "number",
    //       example: 99.99,
    //     },
    //   },
    //   [],
    //   {
    //     name: "Sample Product",
    //     sku: "SKU-001",
    //     description: "Sample product used for testing",
    //     price: 99.99,
    //   },
    // ),
};
export default reqSchemas;
