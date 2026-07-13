import reqSchemas from "./open-api-schema/req-schema.js";
import resSchemas from "./open-api-schema/res-schema.js";
export const queryParam = (name, description, required = false, schema = { type: "string" }) => ({
    name,
    in: "query",
    required,
    description,
    schema,
});
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
// function pathParam(name: string, description: string) {
//   return {
//     name,
//     description,
//   };
// }
export const pathParam = (name, description, schema = { type: "string" }) => ({
    name,
    in: "path",
    required: true,
    description,
    schema,
});
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
                        anyOf: [{ $ref: "#/components/schemas/Product" }, { type: "null" }],
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
function crudPaths(path, reqTitle, schema, tags) {
    const requestSchemaRef = { $ref: `#/components/reqSchemas/${schema}` };
    const responseSchemaRef = {
        $ref: `#/components/resSchemas/${schema}`,
    };
    return {
        [path]: {
            get: {
                tags: tags,
                summary: `List All ${reqTitle}`,
                responses: {
                    200: ok({ type: "array" }),
                    500: errorResponse("Server error"),
                },
            },
            post: {
                tags: tags,
                summary: `Create ${reqTitle}`,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: requestSchemaRef,
                        },
                    },
                },
                responses: {
                    200: created(responseSchemaRef),
                    400: errorResponse("Invalid request"),
                    500: errorResponse("Server error"),
                },
            },
        },
        [`${path}/{id}`]: {
            get: {
                tags: tags,
                summary: `Get ${reqTitle} by id`,
                parameters: [pathParam("id", `${reqTitle} id`)],
                responses: {
                    200: ok(responseSchemaRef),
                    400: errorResponse("Invalid id"),
                    404: errorResponse("Not found"),
                    500: errorResponse("Server error"),
                },
            },
            put: {
                tags: tags,
                summary: `Update ${reqTitle} info`,
                parameters: [pathParam("id", "Order Id", { type: "integer" })],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: `#/components/reqSchemas/${schema}-update` },
                        },
                    },
                },
                responses: {
                    200: "success",
                    400: errorResponse("Invalid request"),
                    404: errorResponse("Not found"),
                    500: errorResponse("Server error"),
                },
            },
            delete: {
                tags: tags,
                summary: `Delete ${reqTitle} by id`,
                parameters: [pathParam("id", `${reqTitle} id`)],
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
            title: options.title ?? "Stock Pro API",
            version: options.version ?? "1.0.0",
            description: options.description ??
                "Api documentation for the Stock pro routes, product CRUD, and inventory-management actions. Product details in the docs reflect a configurable example model and may differ in host apps or tests.",
        },
        tags: [
            {
                name: "Orders",
                description: "All crud operations for Order management",
            },
            {
                name: "Warehouses",
                description: "All crud operations for Warehouses management",
            },
            {
                name: "Inventory",
                description: "All crud operations for Inventories management",
            },
        ],
        servers: options.servers ??
            (prefixServerUrl ? [{ url: prefixServerUrl }] : undefined),
        components: {
            reqSchemas,
            resSchemas,
        },
        paths: {
            ...crudPaths("/warehouses", "Warehouse", "Warehouse", ["Warehouses"]),
            ...crudPaths("/orders", "Orders", "Orders", ["Orders"]),
            "orders/type/{order_type}": {
                get: {
                    tags: ["Orders"],
                    summary: "List orders by type",
                    description: "URI /orders/type/{order_type}?status={status}&include={orderItems}&customer_id={customer_id} \n status and include query params are optional",
                    parameters: [
                        pathParam("order_type", "Order type", {
                            type: "string",
                            enum: ["sales", "purchase"],
                        }),
                        queryParam("customer_id", "Customer Id", false, {
                            type: "string",
                        }),
                        queryParam("status", "Filter by status", false, {
                            type: "string",
                            enum: ["status"],
                        }),
                        queryParam("include", "Include related resources", false, {
                            type: "string",
                            enum: ["orderItems"],
                        }),
                        queryParam("draw", "DataTables draw counter", false, {
                            type: "integer",
                            default: 1,
                        }),
                        queryParam("start", "Starting record index", false, {
                            type: "integer",
                            default: 0,
                        }),
                        queryParam("length", "Number of records to return", false, {
                            type: "integer",
                            default: 10,
                        }),
                    ],
                    responses: {
                        200: created(resSchemas["Orders"]),
                        400: errorResponse("Invalid request"),
                        500: errorResponse("Server error"),
                    },
                },
            },
            "/orders/{id}/items": {
                get: {
                    tags: ["Orders"],
                    summary: "Fetch Order Items",
                    description: "This api is used fetch order items by order id you will product info as well",
                    parameters: [pathParam("id", "Purchase order id")],
                    responses: {
                        200: ok(""),
                    },
                },
            },
            "/orders/account-receivable": {
                get: {
                    tags: ["Orders"],
                    summary: "Fetch Order Amount Receivable",
                    description: "This api is used fetch the total due amount on sales orders",
                    responses: {
                        200: ok(""),
                    },
                },
            },
            "/orders/account-payable": {
                get: {
                    tags: ["Orders"],
                    summary: "Orders Payable Amount",
                    description: "This api is used fetch the total due amount on purchase orders",
                    responses: {
                        200: ok(""),
                    },
                },
            },
            ...crudPaths("/inventories", "Inventory", "Inventory", ["Inventory"]),
            "product-inventory": {
                get: {
                    tags: ["Inventory"],
                    summary: "Product grouped inventory",
                    description: "This api is used to Fetch product wise/grouped total inventory",
                    responses: {
                        200: ok(""),
                    },
                },
            },
            // ...crudPaths("/products", "Product", "products", "Product"),
            // "/inventories/warehouse/{warehouseId}": {
            //   get: {
            //     summary: "List inventory by warehouse",
            //     parameters: [pathParam("warehouseId", "Warehouse id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/Inventory" },
            //       }),
            //       400: errorResponse("Invalid warehouse id"),
            //     },
            //   },
            // },
            // "/inventories/product/{productId}": {
            //   get: {
            //     summary: "List inventory by product",
            //     parameters: [pathParam("productId", "Product id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/Inventory" },
            //       }),
            //       400: errorResponse("Invalid product id"),
            //     },
            //   },
            // },
            // "/inventories/product/{productId}/warehouse/{warehouseId}": {
            //   get: {
            //     summary: "Get inventory by product and warehouse",
            //     parameters: [
            //       pathParam("productId", "Product id"),
            //       pathParam("warehouseId", "Warehouse id"),
            //     ],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Inventory" }),
            //       400: errorResponse("Invalid ids"),
            //       404: errorResponse("Not found"),
            //     },
            //   },
            // },
            // "/inventories/adjust-stock": {
            //   post: {
            //     summary: "Adjust inventory stock",
            //     requestBody: {
            //       required: true,
            //       content: {
            //         "application/json": {
            //           schema: { $ref: "#/components/schemas/AdjustStockRequest" },
            //         },
            //       },
            //     },
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Inventory" }),
            //       400: errorResponse("Invalid request"),
            //       404: errorResponse("Inventory not found"),
            //     },
            //   },
            // },
            // ...crudPaths(
            //   "/purchase-order-items",
            //   "OrderItems",
            //   "purchase-order-items",
            //   "OrderItems",
            // ),
            // "/purchase-order-items/by-order/{orderId}": {
            //   get: {
            //     summary: "List purchase order items by order",
            //     parameters: [pathParam("orderId", "Purchase order id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/OrderItems" },
            //       }),
            //     },
            //   },
            // },
            // ...crudPaths("/sales-orders", "Orders", "sales-orders", "Orders"),
            // "/sales-orders/{id}/items": {
            //   get: {
            //     summary: "Get sales order with items",
            //     parameters: [pathParam("id", "Sales order id")],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Orders" }),
            //     },
            //   },
            // },
            // ...crudPaths(
            //   "/sales-order-items",
            //   "OrderItems",
            //   "sales-order-items",
            //   "OrderItems",
            // ),
            // "/sales-order-items/by-order/{orderId}": {
            //   get: {
            //     summary: "List sales order items by order",
            //     parameters: [pathParam("orderId", "Sales order id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/OrderItems" },
            //       }),
            //     },
            //   },
            // },
            // ...crudPaths(
            //   "/sales-order-item-allocations",
            //   "SalesOrderItemAllocation",
            //   "sales-order-item-allocations",
            //   "SalesOrderItemAllocation",
            // ),
            // "/sales-order-item-allocations/by-warehouse/{warehouseId}": {
            //   get: {
            //     summary: "List allocations by warehouse",
            //     parameters: [pathParam("warehouseId", "Warehouse id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/SalesOrderItemAllocation" },
            //       }),
            //     },
            //   },
            // },
            // "/sales-order-item-allocations/by-order-item/{orderItemId}": {
            //   get: {
            //     summary: "List allocations by sales order item",
            //     parameters: [pathParam("orderItemId", "Sales order item id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: { $ref: "#/components/schemas/SalesOrderItemAllocation" },
            //       }),
            //     },
            //   },
            // },
            // "/query/sales-order-items/{salesOrderItemId}/products": {
            //   get: {
            //     summary: "Get sales order item with product",
            //     parameters: [pathParam("salesOrderItemId", "Sales order item id")],
            //     responses: {
            //       200: ok(
            //         withProductSchema({
            //           $ref: "#/components/schemas/OrderItems",
            //         }),
            //       ),
            //       404: errorResponse("Not found"),
            //       400: errorResponse("Invalid sales order item id"),
            //     },
            //   },
            // },
            // "/query/sales-orders/by-business/{businessId}/products": {
            //   get: {
            //     summary: "List sales orders with products",
            //     parameters: [pathParam("businessId", "Business id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: withProductsSchema({
            //           $ref: "#/components/schemas/Orders",
            //         }),
            //       }),
            //       400: errorResponse("Invalid business id"),
            //     },
            //   },
            // },
            // "/query/sales-orders/{salesOrderId}/products": {
            //   get: {
            //     summary: "Get sales order with products",
            //     parameters: [pathParam("salesOrderId", "Sales order id")],
            //     responses: {
            //       200: ok(
            //         withProductsSchema({ $ref: "#/components/schemas/Orders" }),
            //       ),
            //       404: errorResponse("Not found"),
            //       400: errorResponse("Invalid sales order id"),
            //     },
            //   },
            // },
            // "/query/purchase-order-items/{purchaseOrderItemId}/products": {
            //   get: {
            //     summary: "Get purchase order item with product",
            //     parameters: [
            //       pathParam("purchaseOrderItemId", "Purchase order item id"),
            //     ],
            //     responses: {
            //       200: ok(
            //         withProductSchema({
            //           $ref: "#/components/schemas/OrderItems",
            //         }),
            //       ),
            //       404: errorResponse("Not found"),
            //       400: errorResponse("Invalid purchase order item id"),
            //     },
            //   },
            // },
            // "/query/purchase-orders/products": {
            //   post: {
            //     summary: "List purchase orders with products",
            //     requestBody: {
            //       required: true,
            //       content: {
            //         "application/json": {
            //           schema: objectSchema(
            //             {
            //               businessId: { type: "integer", minimum: 1 },
            //               createdBy: { type: "integer", minimum: 1 },
            //             },
            //             [],
            //           ),
            //         },
            //       },
            //     },
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: withProductsSchema({
            //           $ref: "#/components/schemas/Orders",
            //         }),
            //       }),
            //       400: errorResponse("Invalid request"),
            //     },
            //   },
            // },
            // "/query/purchase-orders/{purchaseOrderId}/products": {
            //   get: {
            //     summary: "Get purchase order with products",
            //     parameters: [pathParam("purchaseOrderId", "Purchase order id")],
            //     responses: {
            //       200: ok(
            //         withProductsSchema({
            //           $ref: "#/components/schemas/Orders",
            //         }),
            //       ),
            //       404: errorResponse("Not found"),
            //       400: errorResponse("Invalid purchase order id"),
            //     },
            //   },
            // },
            // "/query/inventory/{productId}/products": {
            //   get: {
            //     summary: "List inventory with products",
            //     parameters: [pathParam("productId", "Product id")],
            //     responses: {
            //       200: ok({
            //         type: "array",
            //         items: withProductSchema({
            //           $ref: "#/components/schemas/Inventory",
            //         }),
            //       }),
            //       400: errorResponse("Invalid product id"),
            //     },
            //   },
            // },
            // "/inventory-management/purchase-orders/{purchaseOrderId}/receive": {
            //   post: {
            //     summary: "Receive a purchase order",
            //     parameters: [pathParam("purchaseOrderId", "Purchase order id")],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Orders" }),
            //     },
            //   },
            // },
            // "/inventory-management/sales-orders/{salesOrderId}/allocate": {
            //   post: {
            //     summary: "Allocate inventory for a sales order",
            //     parameters: [pathParam("salesOrderId", "Sales order id")],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Orders" }),
            //     },
            //   },
            // },
            // "/inventory-management/sales-orders/{salesOrderId}/ship": {
            //   post: {
            //     summary: "Mark a sales order as shipped",
            //     parameters: [pathParam("salesOrderId", "Sales order id")],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Orders" }),
            //     },
            //   },
            // },
            // "/inventory-management/sales-orders/{salesOrderId}/cancel": {
            //   post: {
            //     summary: "Cancel a sales order",
            //     parameters: [pathParam("salesOrderId", "Sales order id")],
            //     responses: {
            //       200: ok({ $ref: "#/components/schemas/Orders" }),
            //     },
            //   },
            // },
            // "/inventory-management/stock/transfer": {
            //   post: {
            //     summary: "Transfer stock between warehouses",
            //     requestBody: {
            //       required: true,
            //       content: {
            //         "application/json": {
            //           schema: { $ref: "#/components/schemas/TransferStockRequest" },
            //         },
            //       },
            //     },
            //     responses: {
            //       200: ok({
            //         type: "object",
            //         properties: {
            //           source: { $ref: "#/components/schemas/Inventory" },
            //           target: { $ref: "#/components/schemas/Inventory" },
            //         },
            //       }),
            //     },
            //   },
            // },
        },
    };
}
export function createAutoPoolOpenApiConfig(options = {}) {
    const prefixPath = options.openApi?.prefixPath ?? options.prefixPath ?? "/api";
    return {
        path: options.openApiPath ?? "/openapi.json",
        document: createAutoPoolOpenApiDocument({
            ...options.openApi,
            prefixPath,
        }),
    };
}
export function registerOpenApiJsonRoute(target, document, options = {}) {
    const path = options.path ?? "/openapi.json";
    target.get(path, (_request, replyOrResponse) => {
        if (replyOrResponse.code) {
            return replyOrResponse.code(200).send(document);
        }
        return replyOrResponse.status?.(200).json(document);
    });
}
