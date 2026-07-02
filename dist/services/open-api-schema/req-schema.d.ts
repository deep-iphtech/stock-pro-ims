declare const reqSchemas: {
    readonly Warehouse: {
        example?: Record<string, unknown> | undefined;
        required?: string[] | undefined;
        type: string;
        properties: Record<string, unknown>;
    };
    readonly "Warehouse-update": {
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
            readonly status: {
                readonly type: "string";
                readonly example: "draft";
            };
            readonly notes: {
                readonly type: "string";
            };
            readonly payment_status: {
                readonly type: "string";
                readonly example: "pending";
            };
            readonly paid_at: {
                readonly type: "date";
            };
            readonly order_meta: {
                readonly type: "object";
            };
            readonly shipping_charges: {
                readonly type: "integer";
            };
            readonly discount: {
                readonly type: "integer";
            };
            readonly products: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly product_id: {
                            readonly type: "integer";
                        };
                        readonly warehouse_id: {
                            readonly type: "integer";
                        };
                        readonly quantity: {
                            readonly type: "integer";
                        };
                        readonly quantity_allocation: {
                            readonly type: "string";
                            readonly example: "1:5";
                        };
                        readonly price: {
                            readonly type: "integer";
                        };
                    };
                    readonly required: readonly ["product_id", "quantity", "price"];
                };
            };
        };
        readonly required: readonly ["customer_id", "order_type", "products"];
    };
    readonly "Orders-update": {
        readonly type: "object";
        readonly properties: {
            readonly status: {
                readonly type: "string";
            };
            readonly shipment_tracking_number: {
                readonly type: "string";
            };
            readonly order_meta: {
                readonly type: "object";
                readonly additionalProperties: true;
            };
        };
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
export default reqSchemas;
