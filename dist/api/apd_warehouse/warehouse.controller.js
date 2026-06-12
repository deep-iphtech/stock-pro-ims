import warehouseService from "./warehouse.service.js";
export const getAllwarehouse = async () => {
    try {
        const warehouse = await warehouseService.findAll();
        // TODO: respone it
        return warehouse;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getwarehouseId = async () => {
    try {
        const warehouse = await warehouseService.findById(1);
        // TODO: response it
        return warehouse;
    }
    catch (error) {
        throw error;
    }
};
export const createwarehouse = async () => {
    try {
        const warehouse = await warehouseService.create("");
        return warehouse;
    }
    catch (error) {
        throw error;
    }
};
export const updatewarehouse = async () => {
    try {
        const warehouse = await warehouseService.update(2, "");
        return warehouse;
    }
    catch (error) {
        throw error;
    }
};
export const deletewarehouse = async () => {
    try {
        const warehouse = await warehouseService.delete(3);
        return warehouse;
    }
    catch (error) {
        throw error;
    }
};
