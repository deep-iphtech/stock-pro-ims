import type { AutoPoolDB } from "../../core/types.js";
export declare class ProductService {
    private readonly db;
    private readonly productTable;
    constructor(db: AutoPoolDB);
    findAll(): Promise<object[]>;
    findById(id: number): Promise<object>;
    create(data: Record<string, unknown>): Promise<object>;
    update(id: number, data: Record<string, unknown>): Promise<object>;
    delete(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map