import userService from "../services/orders/user.service.js";
import { customerIdSchema } from "../validations/order.schema.js";
export function buildCustomerRoutes(defaultPath) {
    return [
        {
            method: "post",
            path: defaultPath + "/fetch-customer-credits",
            handler: async ({ body }) => {
                const { customer_id } = customerIdSchema.parse(body);
                const data = await userService.userCredits(customer_id);
                return {
                    success: true,
                    data,
                };
            },
        },
    ];
}
