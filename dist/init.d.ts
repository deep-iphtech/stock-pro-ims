import type { AutoPoolDB, CreateAutoPoolOptions } from "./core/types.js";
import { initializeAutoPoolData, syncAutoPoolData } from "./models/initModels.js";
export declare function createAutoPool(options?: CreateAutoPoolOptions): Promise<AutoPoolDB>;
export { initializeAutoPoolData, syncAutoPoolData };
//# sourceMappingURL=init.d.ts.map