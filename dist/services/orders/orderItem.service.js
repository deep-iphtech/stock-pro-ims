import { OrderItems } from "../../models/OrderItems.js";
const orderItemService = {
    update: async (data, options) => {
        return await OrderItems.update(data, options);
    },
    findById: async (id) => {
        return await OrderItems.findByPk(id);
    },
    create: async (data, transaction) => {
        return await OrderItems.create(data, { transaction });
    },
    delete: async (id, transaction) => {
        return await OrderItems.destroy({
            where: { id },
            transaction,
        });
    },
};
export default orderItemService;
