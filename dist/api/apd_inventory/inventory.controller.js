import inventoryService from "./inventory.service.js";
let productId = 2, warehouseId = 2, quantity = 5;
export const getAllInventory = async () => {
    try {
        const inventory = await inventoryService.findAll();
        // TODO: respone it
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getInventoryId = async () => {
    try {
        const inventory = await inventoryService.findById(1);
        // TODO: response it
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const createInventory = async () => {
    try {
        const inventory = await inventoryService.create("");
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const updateInventory = async () => {
    try {
        const inventory = await inventoryService.update(2, "");
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const deleteInventory = async () => {
    try {
        const inventory = await inventoryService.delete(3);
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const getInventoryByWareHouse = async () => {
    try {
        const inventory = await inventoryService.findByWarehouse(3);
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const getInventoryByProductId = async () => {
    try {
        const inventory = await inventoryService.findByProduct(3);
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const getInventoryByProductIdAndWarehouseId = async () => {
    try {
        const inventory = await inventoryService.findByProductAndWarehouse(productId, warehouseId);
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
export const adjustInventoryAdjustStock = async () => {
    try {
        const inventory = await inventoryService.adjustStock(productId, warehouseId, quantity);
        return inventory;
    }
    catch (error) {
        throw error;
    }
};
