import type { AutoPoolDB } from "../../core/types.js";
type JsonObject = Record<string, unknown>;
type JsonRecord = JsonObject & {
    id?: number;
    product_id?: number;
    items?: JsonObject[];
    product?: JsonObject | null;
    products?: JsonObject[];
};
export declare function quoteIdentifier(identifier: string): string;
export declare function getProductsTable(db: AutoPoolDB): string;
export declare class QueryService {
    private readonly db;
    constructor(db: AutoPoolDB);
    fetchSalesOrderItemWithProducts(salesOrderItemId?: number): Promise<JsonRecord | {
        product: JsonObject | null;
        id?: number;
        product_id?: number;
        items?: JsonObject[];
        products?: JsonObject[];
    } | {
        product: JsonObject | null;
        id?: number;
        product_id?: number;
        items?: JsonObject[];
        products?: JsonObject[];
    }[] | JsonRecord[] | null>;
    fetchSalesOrdersWithProducts(businessId?: number): Promise<JsonRecord[] | ({
        items: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        products: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        id?: number;
        product_id?: number;
        product?: JsonObject | null;
    } | null)[]>;
    fetchSalesOrderWithProducts(salesOrderId: number): Promise<JsonRecord | {
        items: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        products: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        id?: number;
        product_id?: number;
        product?: JsonObject | null;
    } | null>;
    fetchPurchaseOrderItemWithProducts(purchaseOrderItemId?: number): Promise<JsonRecord | {
        product: JsonObject | null;
        id?: number;
        product_id?: number;
        items?: JsonObject[];
        products?: JsonObject[];
    } | {
        product: JsonObject | null;
        id?: number;
        product_id?: number;
        items?: JsonObject[];
        products?: JsonObject[];
    }[] | JsonRecord[] | null>;
    fetchPurchaseOrdersWithProducts(options?: {
        businessId?: number;
        createdBy?: number;
    }): Promise<JsonRecord[] | ({
        items: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        products: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        id?: number;
        product_id?: number;
        product?: JsonObject | null;
    } | null)[]>;
    fetchPurchaseOrderWithProducts(purchaseOrderId: number): Promise<JsonRecord | {
        items: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        products: {
            product: JsonObject | null;
            id?: number;
            product_id?: number;
            items?: JsonObject[];
            products?: JsonObject[];
        }[];
        id?: number;
        product_id?: number;
        product?: JsonObject | null;
    } | null>;
    fetchInventoryWithProducts(productId?: number): Promise<JsonRecord[] | {
        product: JsonObject | null;
        id?: number;
        product_id?: number;
        items?: JsonObject[];
        products?: JsonObject[];
    }[]>;
}
export default QueryService;
//# sourceMappingURL=queries.service.d.ts.map