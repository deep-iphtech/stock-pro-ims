import purchase_orderService from "./purchase_order.service.js";
const purchaseId = 0;
export const getAllPurchaseOrder = async () => {
    try {
        const purchase_order = await purchase_orderService.findAll();
        // TODO: respone it
        return purchase_order;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getpurchase_orderId = async () => {
    try {
        const purchase_order = await purchase_orderService.findById(1);
        // TODO: response it
        return purchase_order;
    }
    catch (error) {
        throw error;
    }
};
export const createpurchase_order = async () => {
    try {
        const purchase_order = await purchase_orderService.create("");
        return purchase_order;
    }
    catch (error) {
        throw error;
    }
};
export const updatepurchase_order = async () => {
    try {
        const purchase_order = await purchase_orderService.update(2, "");
        return purchase_order;
    }
    catch (error) {
        throw error;
    }
};
export const deletepurchase_order = async () => {
    try {
        const purchase_order = await purchase_orderService.delete(3);
        return purchase_order;
    }
    catch (error) {
        throw error;
    }
};
export const getPurchaseOrderWithItems = async () => {
    try {
        const purchaseWithItems = await purchase_orderService.findWithItems(purchaseId);
        return purchaseWithItems;
    }
    catch (error) {
        throw error;
    }
};
