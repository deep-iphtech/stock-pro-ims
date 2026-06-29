import { Model, ModelStatic } from "sequelize";
export declare class BaseService<T extends Model> {
    protected model: ModelStatic<T>;
    constructor(model: ModelStatic<T>);
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: number, data: any): Promise<T>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=base.service.d.ts.map