import sales_order_item_allocationService from "./sales_order_item_allocation.service.js";
let warehouseId = 23, orderId = 2;
export const getAllsales_order_item_allocation = async () => {
    try {
        const sales_order_item_allocation = await sales_order_item_allocationService.findAll();
        // TODO: respone it
        return sales_order_item_allocation;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getsales_order_item_allocationId = async () => {
    try {
        const sales_order_item_allocation = await sales_order_item_allocationService.findById(1);
        // TODO: response it
        return sales_order_item_allocation;
    }
    catch (error) {
        throw error;
    }
};
export const createsales_order_item_allocation = async () => {
    try {
        const sales_order_item_allocation = await sales_order_item_allocationService.create("");
        return sales_order_item_allocation;
    }
    catch (error) {
        throw error;
    }
};
export const updatesales_order_item_allocation = async () => {
    try {
        const sales_order_item_allocation = await sales_order_item_allocationService.update(2, "");
        return sales_order_item_allocation;
    }
    catch (error) {
        throw error;
    }
};
export const deletesales_order_item_allocation = async () => {
    try {
        const sales_order_item_allocation = await sales_order_item_allocationService.delete(3);
        return sales_order_item_allocation;
    }
    catch (error) {
        throw error;
    }
};
export const salesOrderAllocationByWareHouse = async () => {
    try {
        const s = await sales_order_item_allocationService.findByWarehouse(warehouseId);
        return s;
    }
    catch (error) {
        throw error;
    }
};
export const salesOrderAllocationByOrderId = async () => {
    try {
        const s = await sales_order_item_allocationService.findByOrderItem(orderId);
        return s;
    }
    catch (error) {
        throw error;
    }
};
