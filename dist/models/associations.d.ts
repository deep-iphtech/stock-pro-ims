import { ModelStatic } from "sequelize";
export declare function hasProductAssociation(model: {
    associations?: Record<string, unknown>;
}): boolean;
export declare function setupAssociations(models?: Record<string, ModelStatic<any> | undefined>): void;
