/*
  Raw SQL queries are used because the products table name
  is determined dynamically at runtime. Sequelize models
  require a fixed table name, so CRUD operations are executed
  using parameterized queries against the configured product table.
*/
import { QueryTypes } from "@sequelize/core";
import { getProductsTable, quoteIdentifier, } from "../queries_fetch/queries.service.js";
export class ProductService {
    db;
    productTable;
    constructor(db) {
        this.db = db;
        this.productTable = quoteIdentifier(getProductsTable(db));
    }
    async findAll() {
        return this.db.sequelize.query(`SELECT * FROM ${this.productTable}`, {
            type: QueryTypes.SELECT,
        });
    }
    async findById(id) {
        const results = await this.db.sequelize.query(`
      SELECT *
      FROM ${this.productTable}
      WHERE id = :id
      `, {
            replacements: { id },
            type: QueryTypes.SELECT,
        });
        return results[0] ?? null;
    }
    async create(data) {
        if (!Object.keys(data).length) {
            throw new Error("No data provided for create");
        }
        const columns = Object.keys(data);
        const values = columns.map((column) => `:${column}`);
        const query = `
      INSERT INTO ${this.productTable}
      (${columns.map(quoteIdentifier).join(", ")})
      VALUES (${values.join(", ")})
      RETURNING *;
    `;
        const results = await this.db.sequelize.query(query, {
            replacements: data,
            type: QueryTypes.SELECT,
        });
        return results[0] ?? null;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new Error(`Product with id ${id} not found`);
        }
        const updateData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== "id"));
        if (!Object.keys(updateData).length) {
            throw new Error("No fields provided for update");
        }
        const setClause = Object.keys(updateData)
            .map((key) => `${quoteIdentifier(key)} = :${key}`)
            .join(", ");
        const query = `
      UPDATE ${this.productTable}
      SET ${setClause}
      WHERE id = :id
      RETURNING *;
    `;
        const results = await this.db.sequelize.query(query, {
            replacements: {
                id,
                ...updateData,
            },
            type: QueryTypes.SELECT,
        });
        return results[0] ?? null;
    }
    async delete(id) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new Error(`Product with id ${id} not found`);
        }
        await this.db.sequelize.query(`
      DELETE FROM ${this.productTable}
      WHERE id = :id
      `, {
            replacements: { id },
        });
        return {
            success: true,
            message: `Product ${id} deleted successfully`,
        };
    }
}
