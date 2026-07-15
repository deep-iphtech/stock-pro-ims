import { OrderItems } from "../../models/OrderItems.js";
declare const orderItemService: {
    update: (data: any, options: {
        where: {
            id: number | string;
        };
        transaction?: any;
    }) => Promise<[affectedCount: number]>;
    findById: (id: number | string) => Promise<OrderItems | null>;
    findMultipleById: (ids: number[] | string[]) => Promise<OrderItems[]>;
    create: (data: any, transaction?: any) => Promise<OrderItems>;
    delete: (id: number | string, transaction?: any) => Promise<number>;
};
export default orderItemService;
