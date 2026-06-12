import sales_order_itemService from "./sales_order_item.service.js";
let orderId = 2;
export const getAllsales_order = async () => {
    try {
        const sales_order = await sales_order_itemService.findAll();
        // TODO: respone it
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
// TODO: may be used with expess or with fastify
export const getsales_orderId = async () => {
    try {
        const sales_order = await sales_order_itemService.findById(1);
        // TODO: response it
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const createsales_order = async () => {
    try {
        const sales_order = await sales_order_itemService.create("");
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const updatesales_order = async () => {
    try {
        const sales_order = await sales_order_itemService.update(2, "");
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const deletesales_order = async () => {
    try {
        const sales_order = await sales_order_itemService.delete(3);
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const getsales_orderByOrderId = async () => {
    try {
        const s = await sales_order_itemService.findByOrder(orderId);
    }
    catch (error) {
        throw error;
    }
};
