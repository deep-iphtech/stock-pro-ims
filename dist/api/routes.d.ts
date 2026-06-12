import type { AutoPoolDB } from "../core/types.js";
import { HttpMethod, RouteContext, type RouteDefinition } from "./http.js";
export declare function buildAutoPoolRoutes(db: AutoPoolDB, defaultPath: string): (RouteDefinition | {
    method: HttpMethod;
    path: string;
    handler: (request: RouteContext) => Promise<object>;
})[];
//# sourceMappingURL=routes.d.ts.map