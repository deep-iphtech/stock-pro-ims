import { Inventory } from "../../models/Inventory.js";
import { BaseService } from "../base/base.service.js";
import { fn, col, literal, Op, where, cast, } from "sequelize";
const whereClause = {};
export class InventoryService extends BaseService {
    constructor() {
        super(Inventory);
    }
    async getAllProductsInventory(query) {
        const draw = Number(query.draw ?? 1);
        const start = Number(query.start ?? 0);
        const length = Number(query.length ?? 10);
        const searchValue = query["search[value]"] ?? "";
        const orderColumnIndex = Number(query["order[0][column]"] ?? 0);
        const orderDirection = query["order[0][dir]"] === "desc" ? "DESC" : "ASC";
        /**
         * Parse DataTables columns:
         * columns[0][data]=product_id
         * columns[1][data]=total_available
         */
        const columns = [];
        let index = 0;
        while (query[`columns[${index}][data]`]) {
            columns.push({
                data: query[`columns[${index}][data]`],
            });
            index++;
        }
        const columnName = columns[orderColumnIndex]?.data ?? "product_id";
        /**
         * Search
         */
        const whereClause = {};
        const searchConditions = [];
        if (searchValue) {
            searchConditions.push(where(cast(col("product_id"), "TEXT"), {
                [Op.iLike]: `%${searchValue}%`,
            }));
        }
        /**
         * Sorting
         */
        let orderBy = [["product_id", "ASC"]];
        switch (columnName) {
            case "product_id":
                orderBy = [["product_id", orderDirection]];
                break;
            case "total_available":
                orderBy = [[literal('"total_available"'), orderDirection]];
                break;
            case "total_reserved":
                orderBy = [[literal('"total_reserved"'), orderDirection]];
                break;
            default:
                orderBy = [["product_id", orderDirection]];
                break;
        }
        /**
         * Total records
         */
        const totalRecords = await Inventory.count({
            distinct: true,
            col: "product_id",
        });
        /**
         * Filtered records
         */
        const filteredRecords = await Inventory.count({
            where: whereClause,
            distinct: true,
            col: "product_id",
        });
        /**
         * Data
         */
        const data = await Inventory.findAll({
            where: {
                [Op.and]: searchConditions,
            },
            attributes: [
                [literal(`MIN("Inventory"."id")`), "id"],
                "product_id",
                [fn("SUM", col("Inventory.available_qty")), "total_available"],
                [fn("SUM", col("Inventory.reserved_qty")), "total_reserved"],
                [
                    literal(`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'warehouse_id', "Inventory"."warehouse_id",
              'available_qty', "Inventory"."available_qty",
              'reserved_qty', "Inventory"."reserved_qty"
            )
            ORDER BY "Inventory"."warehouse_id"
          )
        `),
                    "warehouses",
                ],
                [
                    literal(`
          (
            SELECT COALESCE(
              JSONB_OBJECT_AGG(
                t.order_type,
                t.total_quantity
              ),
              '{}'::jsonb
            )
            FROM (
              SELECT
                o.order_type,
                SUM(oi.quantity) AS total_quantity
              FROM ims_order_items oi
              JOIN ims_orders o
                ON o.id = oi.order_id
              WHERE oi.product_id = "Inventory"."product_id"
              GROUP BY o.order_type
            ) t
          )
        `),
                    "order_types",
                ],
            ],
            group: ["Inventory.product_id"],
            order: orderBy,
            offset: start,
            limit: length,
            raw: true,
        });
        return {
            draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data,
        };
    }
    async findByWarehouse(warehouseId) {
        return Inventory.findAll({
            where: {
                warehouse_id: warehouseId,
            },
        });
    }
    async inventoryByProduct(productId) {
        return await Inventory.findOne({
            where: {
                product_id: productId,
            },
            attributes: [
                [literal(`MIN("Inventory"."id")`), "id"],
                "product_id",
                [
                    literal(`COALESCE(SUM("Inventory"."available_qty"), 0)`),
                    "total_available",
                ],
                [
                    literal(`COALESCE(SUM("Inventory"."reserved_qty"), 0)`),
                    "total_reserved",
                ],
                [
                    literal(`
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'warehouse_id', "Inventory"."warehouse_id",
                'available_qty', "Inventory"."available_qty",
                'reserved_qty', "Inventory"."reserved_qty"
              )
              ORDER BY "Inventory"."warehouse_id"
            ),
            '[]'::json
          )
        `),
                    "warehouses",
                ],
                [
                    literal(`
          (
            SELECT COALESCE(
              JSONB_OBJECT_AGG(order_type, total_quantity),
              '{}'::jsonb
            )
            FROM (
              SELECT
                o.order_type,
                SUM(oi.quantity) AS total_quantity
              FROM ims_order_items oi
              JOIN ims_orders o
                ON o.id = oi.order_id
              WHERE oi.product_id = "Inventory"."product_id"
              GROUP BY o.order_type
            ) t
          )
        `),
                    "order_types",
                ],
            ],
            group: ["Inventory.product_id"],
            raw: true,
        });
    }
    async findByProduct(productId) {
        return Inventory.findAll({
            where: {
                product_id: productId,
            },
        });
    }
    async findByProductAndWarehouse(productId, warehouseId) {
        return Inventory.findOne({
            where: {
                product_id: productId,
                warehouse_id: warehouseId,
            },
        });
    }
    async adjustStock(productId, warehouseId, quantity) {
        const inventory = await this.findByProductAndWarehouse(productId, warehouseId);
        if (!inventory) {
            throw new Error("Inventory not found");
        }
        inventory.available_qty += quantity;
        await inventory.save();
        return inventory;
    }
}
export default new InventoryService();
