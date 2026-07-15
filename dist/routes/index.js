import { buildInventoryRoutes } from "./inventory.routes.js";
import { buildOrderRoutes } from "./order.routes.js";
import { buildWarehouseRoutes } from "./warehouse.routes.js";
export function buildAutoPoolRoutes(defaultPath) {
    return [
        ...buildWarehouseRoutes(defaultPath),
        ...buildInventoryRoutes(defaultPath),
        ...buildOrderRoutes(defaultPath),
    ];
}
