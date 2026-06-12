import sales_orderService from "./sales_order.service.js";
let orderId = 2;
export const getAllsales_order = async () => {
    try {
        const sales_order = await sales_orderService.findAll();
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
        const sales_order = await sales_orderService.findById(1);
        // TODO: response it
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const createsales_order = async () => {
    try {
        const sales_order = await sales_orderService.create("");
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const updatesales_order = async () => {
    try {
        const sales_order = await sales_orderService.update(2, "");
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const deletesales_order = async () => {
    try {
        const sales_order = await sales_orderService.delete(3);
        return sales_order;
    }
    catch (error) {
        throw error;
    }
};
export const getSalesWithItems = async () => {
    try {
        const sales = await sales_orderService.findWithItems(orderId);
    }
    catch (error) {
        throw error;
    }
};
