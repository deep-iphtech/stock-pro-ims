function ok(schema) {
    return {
        description: "OK",
        content: {
            "application/json": {
                schema,
            },
        },
    };
}
function created(schema) {
    return {
        description: "Created",
        content: {
            "application/json": {
                schema,
            },
        },
    };
}
function noContent() {
    return {
        description: "No Content",
    };
}
function errorResponse(description) {
    return {
        description,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
        },
    };
}
function pathParam(name, description) {
    return {
        name,
        in: "path",
        required: true,
        description,
        schema: {
            type: "integer",
            minimum: 1,
        },
    };
}
function normalizeServerUrl(prefixPath) {
    if (!prefixPath) {
        return undefined;
    }
    const trimmed = prefixPath.trim();
    if (!trimmed) {
        return undefined;
    }
    if (trimmed === "/") {
        return "/";
    }
    return trimmed.startsWith("/")
        ? trimmed.replace(/\/+$/, "")
        : `/${trimmed.replace(/\/+$/, "")}`;
}
function objectSchema(properties, required = [], example) {
    return {
        type: "object",
        properties,
        ...(required.length ? { required } : {}),
        ...(example ? { example } : {}),
    };
}
function withProductSchema(baseSchema) {
    return {
        allOf: [
            baseSchema,
            {
                type: "object",
                properties: {
                    product: {
                        anyOf: [
                            { $ref: "#/components/schemas/Product" },
                            { type: "null" },
                        ],
                    },
                },
            },
        ],
    };
}
function withProductsSchema(baseSchema) {
    return {
        allOf: [
            baseSchema,
            {
                type: "object",
                properties: {
                    items: {
                        type: "array",
                        items: withProductSchema({
                            type: "object",
                            additionalProperties: true,
                        }),
                    },
                    products: {
                        type: "array",
                        items: withProductSchema({
                            type: "object",
                            additionalProperties: true,
                        }),
                    },
                },
            },
        ],
    };
}
const entitySchemas = {
    Warehouse: {
        type: "object",
        properties: {
            id: { type: "integer" },
            name: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    WarehouseCreateRequest: objectSchema({
        name: {
            type: "string",
            example: "Central Warehouse",
        },
    }, ["name"], {
        name: "Central Warehouse",
    }),
    WarehouseUpdateRequest: objectSchema({
        name: {
            type: "string",
            example: "Central Warehouse",
        },
    }, [], {
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
    PurchaseOrder: {
        type: "object",
        properties: {
            id: { type: "integer" },
            order_number: { type: "string" },
            business_id: { type: "integer" },
            status: { type: "string" },
            order_date: { type: "string", format: "date" },
            shipping_charges: { type: "number" },
            notes: { type: ["string", "null"] },
            created_by: { type: "integer" },
            payment_status: { type: "string" },
            paid_at: { type: ["string", "null"], format: "date-time" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
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
            enum: ["draft", "pending", "approved", "received", "cancelled"],
            example: "draft",
        },
        order_date: {
            type: "string",
            format: "date",
            example: "2026-06-05",
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
    }, ["order_number", "business_id", "order_date", "created_by"], {
        order_number: "PO-10001",
        business_id: 12,
        status: "draft",
        order_date: "2026-06-05",
        shipping_charges: 25,
        notes: "Initial stock replenishment",
        created_by: 3,
        payment_status: "pending",
        paid_at: null,
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
            enum: ["draft", "pending", "approved", "received", "cancelled"],
            example: "approved",
        },
        order_date: {
            type: "string",
            format: "date",
            example: "2026-06-05",
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
    PurchaseOrderItem: {
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
    PurchaseOrderItemCreateRequest: objectSchema({
        purchase_order_id: {
            type: "integer",
            minimum: 1,
            example: 1001,
        },
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
            example: "wholesale",
        },
        price: {
            type: "number",
            example: 12.5,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
    }, [
        "purchase_order_id",
        "product_id",
        "quantity",
        "pricing_tier",
        "price",
        "warehouse_id",
    ], {
        purchase_order_id: 1001,
        product_id: 2005,
        quantity: 50,
        pricing_tier: "wholesale",
        price: 12.5,
        warehouse_id: 1,
    }),
    PurchaseOrderItemUpdateRequest: objectSchema({
        purchase_order_id: {
            type: "integer",
            minimum: 1,
            example: 1001,
        },
        product_id: {
            type: "integer",
            minimum: 1,
            example: 2005,
        },
        quantity: {
            type: "integer",
            example: 48,
        },
        pricing_tier: {
            type: "string",
            enum: ["retail", "wholesale", "distributor"],
            example: "wholesale",
        },
        price: {
            type: "number",
            example: 12.5,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
    }, [], {
        quantity: 48,
        price: 12.5,
    }),
    SalesOrder: {
        type: "object",
        properties: {
            id: { type: "integer" },
            order_number: { type: "string" },
            business_id: { type: "integer" },
            status: { type: "string" },
            invoice_date: { type: "string", format: "date" },
            shipping_charges: { type: "number" },
            notes: { type: ["string", "null"] },
            created_by: { type: "integer" },
            payment_status: { type: "string" },
            paid_at: { type: ["string", "null"], format: "date" },
            drop_ship_contact: { type: ["string", "null"] },
            shipping_address: { type: ["string", "null"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    SalesOrderCreateRequest: objectSchema({
        order_number: {
            type: "string",
            example: "SO-20001",
        },
        business_id: {
            type: "integer",
            minimum: 1,
            example: 12,
        },
        status: {
            type: "string",
            enum: [
                "draft",
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "completed",
                "cancelled",
            ],
            example: "draft",
        },
        invoice_date: {
            type: "string",
            format: "date",
            example: "2026-06-05",
        },
        shipping_charges: {
            type: "number",
            example: 15,
        },
        notes: {
            type: ["string", "null"],
            example: "Deliver before end of week",
        },
        created_by: {
            type: "integer",
            minimum: 1,
            example: 7,
        },
        payment_status: {
            type: "string",
            enum: ["pending", "partial", "paid"],
            example: "pending",
        },
        paid_at: {
            type: ["string", "null"],
            format: "date",
            example: null,
        },
        drop_ship_contact: {
            type: ["string", "null"],
            example: "Jane Doe",
        },
        shipping_address: {
            type: ["string", "null"],
            example: "12 Market St, Mumbai, MH 400001",
        },
    }, ["order_number", "business_id", "invoice_date", "created_by"], {
        order_number: "SO-20001",
        business_id: 12,
        status: "draft",
        invoice_date: "2026-06-05",
        shipping_charges: 15,
        notes: "Deliver before end of week",
        created_by: 7,
        payment_status: "pending",
        paid_at: null,
        drop_ship_contact: "Jane Doe",
        shipping_address: "12 Market St, Mumbai, MH 400001",
    }),
    SalesOrderUpdateRequest: objectSchema({
        order_number: {
            type: "string",
            example: "SO-20001",
        },
        business_id: {
            type: "integer",
            minimum: 1,
            example: 12,
        },
        status: {
            type: "string",
            enum: [
                "draft",
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "completed",
                "cancelled",
            ],
            example: "confirmed",
        },
        invoice_date: {
            type: "string",
            format: "date",
            example: "2026-06-05",
        },
        shipping_charges: {
            type: "number",
            example: 15,
        },
        notes: {
            type: ["string", "null"],
            example: "Customer confirmed delivery slot",
        },
        created_by: {
            type: "integer",
            minimum: 1,
            example: 7,
        },
        payment_status: {
            type: "string",
            enum: ["pending", "partial", "paid"],
            example: "partial",
        },
        paid_at: {
            type: ["string", "null"],
            format: "date",
            example: "2026-06-05",
        },
        drop_ship_contact: {
            type: ["string", "null"],
            example: "Jane Doe",
        },
        shipping_address: {
            type: ["string", "null"],
            example: "12 Market St, Mumbai, MH 400001",
        },
    }, [], {
        status: "confirmed",
        payment_status: "partial",
        notes: "Customer confirmed delivery slot",
    }),
    SalesOrderItem: {
        type: "object",
        properties: {
            id: { type: "integer" },
            sales_order_id: { type: "integer" },
            product_id: { type: "integer" },
            quantity: { type: "integer" },
            pricing_tier: { type: "string" },
            price: { type: "number" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    SalesOrderItemCreateRequest: objectSchema({
        sales_order_id: {
            type: "integer",
            minimum: 1,
            example: 5001,
        },
        product_id: {
            type: "integer",
            minimum: 1,
            example: 2005,
        },
        quantity: {
            type: "integer",
            example: 10,
        },
        pricing_tier: {
            type: "string",
            enum: ["retail", "wholesale", "distributor"],
            example: "retail",
        },
        price: {
            type: "number",
            example: 19.99,
        },
    }, ["sales_order_id", "product_id", "quantity", "pricing_tier", "price"], {
        sales_order_id: 5001,
        product_id: 2005,
        quantity: 10,
        pricing_tier: "retail",
        price: 19.99,
    }),
    SalesOrderItemUpdateRequest: objectSchema({
        sales_order_id: {
            type: "integer",
            minimum: 1,
            example: 5001,
        },
        product_id: {
            type: "integer",
            minimum: 1,
            example: 2005,
        },
        quantity: {
            type: "integer",
            example: 12,
        },
        pricing_tier: {
            type: "string",
            enum: ["retail", "wholesale", "distributor"],
            example: "retail",
        },
        price: {
            type: "number",
            example: 19.99,
        },
    }, [], {
        quantity: 12,
        price: 19.99,
    }),
    SalesOrderItemAllocation: {
        type: "object",
        properties: {
            id: { type: "integer" },
            sales_order_item_id: { type: "integer" },
            warehouse_id: { type: "integer" },
            quantity: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
    },
    SalesOrderItemAllocationCreateRequest: objectSchema({
        sales_order_item_id: {
            type: "integer",
            minimum: 1,
            example: 8001,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
        quantity: {
            type: "integer",
            example: 10,
        },
    }, ["sales_order_item_id", "warehouse_id", "quantity"], {
        sales_order_item_id: 8001,
        warehouse_id: 1,
        quantity: 10,
    }),
    SalesOrderItemAllocationUpdateRequest: objectSchema({
        sales_order_item_id: {
            type: "integer",
            minimum: 1,
            example: 8001,
        },
        warehouse_id: {
            type: "integer",
            minimum: 1,
            example: 1,
        },
        quantity: {
            type: "integer",
            example: 10,
        },
    }, [], {
        quantity: 10,
    }),
    ErrorResponse: {
        type: "object",
        properties: {
            message: { type: "string" },
        },
        required: ["message"],
    },
    AdjustStockRequest: {
        type: "object",
        required: ["productId", "warehouseId", "quantity"],
        properties: {
            productId: { type: "integer", minimum: 1, example: 101 },
            warehouseId: { type: "integer", minimum: 1, example: 1 },
            quantity: { type: "integer", example: 25 },
        },
        example: {
            productId: 101,
            warehouseId: 1,
            quantity: 25,
        },
    },
    TransferStockRequest: {
        type: "object",
        required: [
            "productId",
            "sourceWarehouseId",
            "targetWarehouseId",
            "quantity",
        ],
        properties: {
            productId: { type: "integer", minimum: 1, example: 101 },
            sourceWarehouseId: { type: "integer", minimum: 1, example: 1 },
            targetWarehouseId: { type: "integer", minimum: 1, example: 2 },
            quantity: { type: "integer", example: 25 },
        },
        example: {
            productId: 101,
            sourceWarehouseId: 1,
            targetWarehouseId: 2,
            quantity: 25,
        },
    },
    Product: {
        type: "object",
        description: "Example product shape shown in Swagger. The actual product model comes from the host app or test setup and may differ.",
        properties: {
            id: { type: "integer", minimum: 1, example: 1 },
            name: { type: "string", example: "Sample Product" },
            sku: { type: "string", example: "SKU-001" },
            description: {
                type: "string",
                example: "Sample product used for testing",
            },
            price: { type: "number", example: 99.99 },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
        },
        required: ["id"],
        additionalProperties: true,
        example: {
            id: 1,
            name: "Sample Product",
            sku: "SKU-001",
            description: "Sample product used for testing",
            price: 99.99,
            created_at: "2026-06-09T00:00:00Z",
            updated_at: "2026-06-09T00:00:00Z",
        },
    },
    ProductCreateRequest: objectSchema({
        name: {
            type: "string",
            example: "Sample Product",
        },
        sku: {
            type: "string",
            example: "SKU-001",
        },
        description: {
            type: "string",
            example: "Sample product used for testing",
        },
        price: {
            type: "number",
            example: 99.99,
        },
    }, [], {
        name: "Sample Product",
        sku: "SKU-001",
        description: "Sample product used for testing",
        price: 99.99,
    }),
    ProductUpdateRequest: objectSchema({
        name: {
            type: "string",
            example: "Sample Product",
        },
        sku: {
            type: "string",
            example: "SKU-001",
        },
        description: {
            type: "string",
            example: "Sample product used for testing",
        },
        price: {
            type: "number",
            example: 99.99,
        },
    }, [], {
        name: "Sample Product",
        sku: "SKU-001",
        description: "Sample product used for testing",
        price: 99.99,
    }),
};
function crudPaths(path, schemaName, itemName, requestSchemaBase) {
    const schemaRef = { $ref: `#/components/schemas/${schemaName}` };
    return {
        [path]: {
            get: {
                summary: `List ${itemName}`,
                responses: {
                    200: ok({ type: "array", items: schemaRef }),
                    500: errorResponse("Server error"),
                },
            },
            post: {
                summary: `Create ${itemName.slice(0, -1)}`,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: `#/components/schemas/${requestSchemaBase}CreateRequest`,
                            },
                        },
                    },
                },
                responses: {
                    201: created(schemaRef),
                    400: errorResponse("Invalid request"),
                    500: errorResponse("Server error"),
                },
            },
        },
        [`${path}/{id}`]: {
            get: {
                summary: `Get ${itemName.slice(0, -1)} by id`,
                parameters: [pathParam("id", `${itemName.slice(0, -1)} id`)],
                responses: {
                    200: ok(schemaRef),
                    400: errorResponse("Invalid id"),
                    404: errorResponse("Not found"),
                    500: errorResponse("Server error"),
                },
            },
            put: {
                summary: `Update ${itemName.slice(0, -1)} by id`,
                parameters: [pathParam("id", `${itemName.slice(0, -1)} id`)],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: `#/components/schemas/${requestSchemaBase}UpdateRequest`,
                            },
                        },
                    },
                },
                responses: {
                    200: ok(schemaRef),
                    400: errorResponse("Invalid request"),
                    404: errorResponse("Not found"),
                    500: errorResponse("Server error"),
                },
            },
            delete: {
                summary: `Delete ${itemName.slice(0, -1)} by id`,
                parameters: [pathParam("id", `${itemName.slice(0, -1)} id`)],
                responses: {
                    204: noContent(),
                    400: errorResponse("Invalid id"),
                    404: errorResponse("Not found"),
                    500: errorResponse("Server error"),
                },
            },
        },
    };
}
export function createAutoPoolOpenApiDocument(options = {}) {
    const prefixServerUrl = normalizeServerUrl(options.prefixPath);
    return {
        openapi: "3.1.0",
        info: {
            title: options.title ?? "stock-pro-ims API",
            version: options.version ?? "1.0.0",
            description: options.description ??
                "Swagger/OpenAPI documentation for the stock-pro-ims routes, product CRUD, and inventory-management actions. Product details in the docs reflect a configurable example model and may differ in host apps or tests.",
        },
        servers: options.servers ??
            (prefixServerUrl ? [{ url: prefixServerUrl }] : undefined),
        components: {
            schemas: entitySchemas,
        },
        paths: {
            ...crudPaths("/warehouses", "Warehouse", "warehouses", "Warehouse"),
            ...crudPaths("/inventories", "Inventory", "inventories", "Inventory"),
            ...crudPaths("/products", "Product", "products", "Product"),
            "/inventories/warehouse/{warehouseId}": {
                get: {
                    summary: "List inventory by warehouse",
                    parameters: [pathParam("warehouseId", "Warehouse id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/Inventory" },
                        }),
                        400: errorResponse("Invalid warehouse id"),
                    },
                },
            },
            "/inventories/product/{productId}": {
                get: {
                    summary: "List inventory by product",
                    parameters: [pathParam("productId", "Product id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/Inventory" },
                        }),
                        400: errorResponse("Invalid product id"),
                    },
                },
            },
            "/inventories/product/{productId}/warehouse/{warehouseId}": {
                get: {
                    summary: "Get inventory by product and warehouse",
                    parameters: [
                        pathParam("productId", "Product id"),
                        pathParam("warehouseId", "Warehouse id"),
                    ],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/Inventory" }),
                        400: errorResponse("Invalid ids"),
                        404: errorResponse("Not found"),
                    },
                },
            },
            "/inventories/adjust-stock": {
                post: {
                    summary: "Adjust inventory stock",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AdjustStockRequest" },
                            },
                        },
                    },
                    responses: {
                        200: ok({ $ref: "#/components/schemas/Inventory" }),
                        400: errorResponse("Invalid request"),
                        404: errorResponse("Inventory not found"),
                    },
                },
            },
            ...crudPaths("/purchase-orders", "PurchaseOrder", "purchase-orders", "PurchaseOrder"),
            "/purchase-orders/{id}/items": {
                get: {
                    summary: "Get purchase order with items",
                    parameters: [pathParam("id", "Purchase order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/PurchaseOrder" }),
                    },
                },
            },
            ...crudPaths("/purchase-order-items", "PurchaseOrderItem", "purchase-order-items", "PurchaseOrderItem"),
            "/purchase-order-items/by-order/{orderId}": {
                get: {
                    summary: "List purchase order items by order",
                    parameters: [pathParam("orderId", "Purchase order id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/PurchaseOrderItem" },
                        }),
                    },
                },
            },
            ...crudPaths("/sales-orders", "SalesOrder", "sales-orders", "SalesOrder"),
            "/sales-orders/{id}/items": {
                get: {
                    summary: "Get sales order with items",
                    parameters: [pathParam("id", "Sales order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/SalesOrder" }),
                    },
                },
            },
            ...crudPaths("/sales-order-items", "SalesOrderItem", "sales-order-items", "SalesOrderItem"),
            "/sales-order-items/by-order/{orderId}": {
                get: {
                    summary: "List sales order items by order",
                    parameters: [pathParam("orderId", "Sales order id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/SalesOrderItem" },
                        }),
                    },
                },
            },
            ...crudPaths("/sales-order-item-allocations", "SalesOrderItemAllocation", "sales-order-item-allocations", "SalesOrderItemAllocation"),
            "/sales-order-item-allocations/by-warehouse/{warehouseId}": {
                get: {
                    summary: "List allocations by warehouse",
                    parameters: [pathParam("warehouseId", "Warehouse id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/SalesOrderItemAllocation" },
                        }),
                    },
                },
            },
            "/sales-order-item-allocations/by-order-item/{orderItemId}": {
                get: {
                    summary: "List allocations by sales order item",
                    parameters: [pathParam("orderItemId", "Sales order item id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: { $ref: "#/components/schemas/SalesOrderItemAllocation" },
                        }),
                    },
                },
            },
            "/query/sales-order-items/{salesOrderItemId}/products": {
                get: {
                    summary: "Get sales order item with product",
                    parameters: [pathParam("salesOrderItemId", "Sales order item id")],
                    responses: {
                        200: ok(withProductSchema({
                            $ref: "#/components/schemas/SalesOrderItem",
                        })),
                        404: errorResponse("Not found"),
                        400: errorResponse("Invalid sales order item id"),
                    },
                },
            },
            "/query/sales-orders/by-business/{businessId}/products": {
                get: {
                    summary: "List sales orders with products",
                    parameters: [pathParam("businessId", "Business id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: withProductsSchema({
                                $ref: "#/components/schemas/SalesOrder",
                            }),
                        }),
                        400: errorResponse("Invalid business id"),
                    },
                },
            },
            "/query/sales-orders/{salesOrderId}/products": {
                get: {
                    summary: "Get sales order with products",
                    parameters: [pathParam("salesOrderId", "Sales order id")],
                    responses: {
                        200: ok(withProductsSchema({ $ref: "#/components/schemas/SalesOrder" })),
                        404: errorResponse("Not found"),
                        400: errorResponse("Invalid sales order id"),
                    },
                },
            },
            "/query/purchase-order-items/{purchaseOrderItemId}/products": {
                get: {
                    summary: "Get purchase order item with product",
                    parameters: [
                        pathParam("purchaseOrderItemId", "Purchase order item id"),
                    ],
                    responses: {
                        200: ok(withProductSchema({
                            $ref: "#/components/schemas/PurchaseOrderItem",
                        })),
                        404: errorResponse("Not found"),
                        400: errorResponse("Invalid purchase order item id"),
                    },
                },
            },
            "/query/purchase-orders/products": {
                post: {
                    summary: "List purchase orders with products",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: objectSchema({
                                    businessId: { type: "integer", minimum: 1 },
                                    createdBy: { type: "integer", minimum: 1 },
                                }, []),
                            },
                        },
                    },
                    responses: {
                        200: ok({
                            type: "array",
                            items: withProductsSchema({
                                $ref: "#/components/schemas/PurchaseOrder",
                            }),
                        }),
                        400: errorResponse("Invalid request"),
                    },
                },
            },
            "/query/purchase-orders/{purchaseOrderId}/products": {
                get: {
                    summary: "Get purchase order with products",
                    parameters: [pathParam("purchaseOrderId", "Purchase order id")],
                    responses: {
                        200: ok(withProductsSchema({
                            $ref: "#/components/schemas/PurchaseOrder",
                        })),
                        404: errorResponse("Not found"),
                        400: errorResponse("Invalid purchase order id"),
                    },
                },
            },
            "/query/inventory/{productId}/products": {
                get: {
                    summary: "List inventory with products",
                    parameters: [pathParam("productId", "Product id")],
                    responses: {
                        200: ok({
                            type: "array",
                            items: withProductSchema({
                                $ref: "#/components/schemas/Inventory",
                            }),
                        }),
                        400: errorResponse("Invalid product id"),
                    },
                },
            },
            "/inventory-management/purchase-orders/{purchaseOrderId}/receive": {
                post: {
                    summary: "Receive a purchase order",
                    parameters: [pathParam("purchaseOrderId", "Purchase order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/PurchaseOrder" }),
                    },
                },
            },
            "/inventory-management/sales-orders/{salesOrderId}/allocate": {
                post: {
                    summary: "Allocate inventory for a sales order",
                    parameters: [pathParam("salesOrderId", "Sales order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/SalesOrder" }),
                    },
                },
            },
            "/inventory-management/sales-orders/{salesOrderId}/ship": {
                post: {
                    summary: "Mark a sales order as shipped",
                    parameters: [pathParam("salesOrderId", "Sales order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/SalesOrder" }),
                    },
                },
            },
            "/inventory-management/sales-orders/{salesOrderId}/cancel": {
                post: {
                    summary: "Cancel a sales order",
                    parameters: [pathParam("salesOrderId", "Sales order id")],
                    responses: {
                        200: ok({ $ref: "#/components/schemas/SalesOrder" }),
                    },
                },
            },
            "/inventory-management/stock/transfer": {
                post: {
                    summary: "Transfer stock between warehouses",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TransferStockRequest" },
                            },
                        },
                    },
                    responses: {
                        200: ok({
                            type: "object",
                            properties: {
                                source: { $ref: "#/components/schemas/Inventory" },
                                target: { $ref: "#/components/schemas/Inventory" },
                            },
                        }),
                    },
                },
            },
        },
    };
}
export function createAutoPoolSwaggerConfig(options = {}) {
    const prefixPath = options.openApi?.prefixPath ?? options.prefixPath ?? "/api";
    return {
        path: options.swaggerPath ?? "/openapi.json",
        document: createAutoPoolOpenApiDocument({
            ...options.openApi,
            prefixPath,
        }),
    };
}
export function registerOpenApiJsonRoute(target, document, options = {}) {
    const path = options.path ?? "/openapi.json";
    target.get(path, (request, replyOrResponse) => {
        if (replyOrResponse.code) {
            return replyOrResponse.code(200).send(document);
        }
        return replyOrResponse.status?.(200).json(document);
    });
}
