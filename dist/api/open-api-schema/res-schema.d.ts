declare const resSchemas: {
    readonly Warehouse: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "integer";
            };
            readonly name: {
                readonly type: "string";
            };
            readonly created_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
            readonly updated_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
        };
    };
    readonly WarehouseCreateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly WarehouseUpdateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly Inventory: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "integer";
            };
            readonly product_id: {
                readonly type: "integer";
            };
            readonly warehouse_id: {
                readonly type: "integer";
            };
            readonly available: {
                readonly type: "integer";
            };
            readonly reserved: {
                readonly type: "integer";
            };
            readonly created_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
            readonly updated_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
        };
    };
    readonly InventoryCreateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly InventoryUpdateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly Orders: {
        readonly type: "object";
        readonly properties: {
            readonly customer_id: {
                readonly type: "integer";
            };
            readonly order_type: {
                readonly type: "string";
                readonly example: "sales";
            };
            readonly products: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly product_id: {
                            readonly type: "integer";
                        };
                        readonly quantity: {
                            readonly type: "integer";
                        };
                        readonly quantity_allocation: {
                            readonly type: "string";
                            readonly example: "1:5";
                        };
                    };
                };
            };
        };
        readonly required: readonly ["customer_id", "order_type", "products"];
    };
    readonly PurchaseOrderCreateItemRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly PurchaseOrderCreateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly PurchaseOrderUpdateRequest: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly OrderItems: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "integer";
            };
            readonly purchase_order_id: {
                readonly type: "integer";
            };
            readonly product_id: {
                readonly type: "integer";
            };
            readonly quantity: {
                readonly type: "integer";
            };
            readonly pricing_tier: {
                readonly type: "string";
            };
            readonly price: {
                readonly type: "number";
            };
            readonly warehouse_id: {
                readonly type: "integer";
            };
            readonly created_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
            readonly updated_at: {
                readonly type: "string";
                readonly format: "date-time";
            };
        };
    };
};
export default resSchemas;
//# sourceMappingURL=res-schema.d.ts.map