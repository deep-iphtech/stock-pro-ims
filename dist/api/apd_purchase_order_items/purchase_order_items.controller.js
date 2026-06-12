import purchase_order_itemsService from "./purchase_order_items.service.js";
let orderId = 2; // for tem remove in future
export const getAllpurchase_order_items = async () => {
    try {
        const purchase_order_items = await purchase_order_itemsService.findAll();
        // TODO: respone it
        return purchase_order_items;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getpurchase_order_itemsId = async () => {
    try {
        const purchase_order_items = await purchase_order_itemsService.findById(1);
        // TODO: response it
        return purchase_order_items;
    }
    catch (error) {
        throw error;
    }
};
export const createpurchase_order_items = async () => {
    try {
        const purchase_order_items = await purchase_order_itemsService.create("");
        return purchase_order_items;
    }
    catch (error) {
        throw error;
    }
};
export const updatepurchase_order_items = async () => {
    try {
        const purchase_order_items = await purchase_order_itemsService.update(2, "");
        return purchase_order_items;
    }
    catch (error) {
        throw error;
    }
};
export const deletepurchase_order_items = async () => {
    try {
        const purchase_order_items = await purchase_order_itemsService.delete(3);
        return purchase_order_items;
    }
    catch (error) {
        throw error;
    }
};
export const getPurchaseByOrderId = async () => {
    try {
        const p = await purchase_order_itemsService.findByOrder(orderId);
    }
    catch (error) {
        throw error;
    }
};
