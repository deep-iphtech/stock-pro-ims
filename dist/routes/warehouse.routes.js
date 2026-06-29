import WarehouseService from "../services/apd_warehouse/warehouse.service.js";
import { createCrudRoutes } from "../services/http.js";
import { warehouseCUSchema } from "../validations/warehouse.schema.js";
export function buildWarehouseRoutes(defaultPath) {
    return createCrudRoutes({
        prefix: defaultPath + "/warehouses",
        service: WarehouseService,
        createBody: (body) => warehouseCUSchema.parse(body),
        updateBody: (body) => warehouseCUSchema.parse(body),
    });
}
