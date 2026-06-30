import { Warehouse } from "../../models/Warehouse.js";
import { BaseService } from "../base/base.service.js";
export class WarehouseService extends BaseService {
    constructor() {
        super(Warehouse);
    }
}
export default new WarehouseService();
