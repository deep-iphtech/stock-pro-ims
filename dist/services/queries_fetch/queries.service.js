import { QueryTypes } from "@sequelize/core";
import { hasProductAssociation } from "../../models/associations.js";
export function quoteIdentifier(identifier) {
    return `"${identifier.replace(/"/g, '""')}"`;
}
export function getProductsTable(db) {
    return db.productsTable ?? "products";
}
function productInclude(model) {
    return hasProductAssociation(model)
        ? [{ association: "product" }]
        : [];
}
function toJson(record) {
    return record.toJSON();
}
function toJsonList(records) {
    return records.map((record) => record.toJSON());
}
async function loadProductMapViaJoin(db, productIds) {
    const uniqueProductIds = [...new Set(productIds)].filter((value) => Number.isInteger(value) && value > 0);
    if (!uniqueProductIds.length) {
        return new Map();
    }
    const tableName = quoteIdentifier(getProductsTable(db));
    const valuesClause = uniqueProductIds.map((id) => `(${id})`).join(", ");
    const rows = await db.sequelize.query(`SELECT p.id, to_jsonb(p) AS product
     FROM ${tableName} AS p
     INNER JOIN (VALUES ${valuesClause}) AS ids(id) ON ids.id = p.id`, {
        type: QueryTypes.SELECT,
    });
    const productMap = new Map();
    for (const row of rows) {
        if (typeof row?.id === "number") {
            productMap.set(row.id, row.product ?? null);
        }
    }
    return productMap;
}
function attachProductToItem(item, productMap) {
    const productId = Number(item.product_id);
    return {
        ...item,
        product: item.product ?? productMap.get(productId) ?? null,
    };
}
function attachProductsToItems(items, productMap) {
    return items.map((item) => attachProductToItem(item, productMap));
}
function attachProductsToOrder(order, productMap) {
    if (!order) {
        return null;
    }
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsWithProducts = attachProductsToItems(items, productMap);
    return {
        ...order,
        items: itemsWithProducts,
        products: itemsWithProducts,
    };
}
export class QueryService {
    db;
    constructor(db) {
        this.db = db;
    }
    async fetchSalesOrderItemWithProducts(salesOrderItemId) {
        const db = this.db;
        const include = productInclude(db.OrderItems);
        if (typeof salesOrderItemId === "number") {
            const item = await db.OrderItems.findByPk(salesOrderItemId, {
                ...(include.length ? { include } : {}),
            });
            if (!item) {
                return null;
            }
            const payload = toJson(item);
            if (include.length) {
                return payload;
            }
            const productMap = await loadProductMapViaJoin(db, [
                Number(payload.product_id),
            ]);
            return attachProductToItem(payload, productMap);
        }
        const items = await db.OrderItems.findAll({
            ...(include.length ? { include } : {}),
        });
        const payload = toJsonList(items);
        if (include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, payload.map((item) => Number(item.product_id)));
        return payload.map((item) => attachProductToItem(item, productMap));
    }
    async fetchSalesOrdersWithProducts(businessId) {
        const db = this.db;
        const includeItems = {
            association: "items",
            include: productInclude(db.OrderItems),
        };
        const where = typeof businessId === "number" ? { business_id: businessId } : undefined;
        const orders = await db.Orders.findAll({
            ...(where ? { where } : {}),
            include: [includeItems],
        });
        const payload = toJsonList(orders);
        if (includeItems.include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, payload.flatMap((order) => Array.isArray(order.items)
            ? order.items.map((item) => Number(item.product_id))
            : []));
        return payload.map((order) => attachProductsToOrder(order, productMap));
    }
    async fetchSalesOrderWithProducts(salesOrderId) {
        const db = this.db;
        const includeItems = {
            association: "items",
            include: productInclude(db.OrderItems),
        };
        const order = await db.Orders.findByPk(salesOrderId, {
            include: [includeItems],
        });
        if (!order) {
            return null;
        }
        const payload = toJson(order);
        if (includeItems.include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, Array.isArray(payload.items)
            ? payload.items.map((item) => Number(item.product_id))
            : []);
        return attachProductsToOrder(payload, productMap);
    }
    async fetchPurchaseOrderItemWithProducts(purchaseOrderItemId) {
        const db = this.db;
        const include = productInclude(db.OrderItems);
        if (typeof purchaseOrderItemId === "number") {
            const item = await db.OrderItems.findByPk(purchaseOrderItemId, {
                ...(include.length ? { include } : {}),
            });
            if (!item) {
                return null;
            }
            const payload = toJson(item);
            if (include.length) {
                return payload;
            }
            const productMap = await loadProductMapViaJoin(db, [
                Number(payload.product_id),
            ]);
            return attachProductToItem(payload, productMap);
        }
        const items = await db.OrderItems.findAll({
            ...(include.length ? { include } : {}),
        });
        const payload = toJsonList(items);
        if (include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, payload.map((item) => Number(item.product_id)));
        return payload.map((item) => attachProductToItem(item, productMap));
    }
    async fetchPurchaseOrdersWithProducts(options = {}) {
        const db = this.db;
        const includeItems = {
            association: "items",
            include: productInclude(db.OrderItems),
        };
        const where = {};
        if (typeof options.businessId === "number") {
            where.business_id = options.businessId;
        }
        if (typeof options.createdBy === "number") {
            where.created_by = options.createdBy;
        }
        const orders = await db.Orders.findAll({
            ...(Object.keys(where).length ? { where } : {}),
            include: [includeItems],
        });
        const payload = toJsonList(orders);
        if (includeItems.include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, payload.flatMap((order) => Array.isArray(order.items)
            ? order.items.map((item) => Number(item.product_id))
            : []));
        return payload.map((order) => attachProductsToOrder(order, productMap));
    }
    async fetchPurchaseOrderWithProducts(purchaseOrderId) {
        const db = this.db;
        const includeItems = {
            association: "items",
            include: productInclude(db.OrderItems),
        };
        const order = await db.Orders.findByPk(purchaseOrderId, {
            include: [includeItems],
        });
        if (!order) {
            return null;
        }
        const payload = toJson(order);
        if (includeItems.include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, Array.isArray(payload.items)
            ? payload.items.map((item) => Number(item.product_id))
            : []);
        return attachProductsToOrder(payload, productMap);
    }
    async fetchInventoryWithProducts(productId) {
        const db = this.db;
        const include = productInclude(db.Inventory);
        const where = typeof productId === "number" ? { product_id: productId } : undefined;
        const inventories = await db.Inventory.findAll({
            ...(where ? { where } : {}),
            ...(include.length ? { include } : {}),
        });
        const payload = toJsonList(inventories);
        if (include.length) {
            return payload;
        }
        const productMap = await loadProductMapViaJoin(db, payload.map((inventory) => Number(inventory.product_id)));
        return payload.map((inventory) => ({
            ...inventory,
            product: inventory.product ??
                productMap.get(Number(inventory.product_id)) ??
                null,
        }));
    }
}
export default QueryService;
