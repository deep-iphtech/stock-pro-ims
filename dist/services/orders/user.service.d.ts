import { Orders } from "../../models/Orders.js";
export declare class UserService {
    userCredits(customerId: number): Promise<Orders | null>;
}
declare const _default: UserService;
export default _default;
