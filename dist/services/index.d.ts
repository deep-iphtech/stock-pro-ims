import type { AutoPoolDB } from "../core/types.js";
import { HttpError, createExpressRouter as createExpressRouterImpl, createCrudRoutes, executeRoute, registerExpressRoutes, registerFastifyRoutes as registerFastifyRoutesImpl, type CrudService, type HttpMethod, type RouteContext, type RouteDefinition, type RouteHandler } from "./http.js";
import { createAutoPoolOpenApiDocument, createAutoPoolOpenApiConfig, registerOpenApiJsonRoute, type CreateOpenApiDocumentOptions, type OpenApiDocument, type OpenApiServer, type AutoPoolOpenApiConfig, type RegisterOpenApiJsonRouteOptions } from "./openapi.js";
import { buildAutoPoolRoutes } from "../routes/index.js";
export type Middleware = (...args: any[]) => unknown;
export type AutoPoolServerOptions = {
    prefixPath?: string;
    openApiPath?: string;
    openApi?: CreateOpenApiDocumentOptions;
    preHandler?: Middleware[];
};
export { buildAutoPoolRoutes, createCrudRoutes, executeRoute, HttpError, registerExpressRoutes, createAutoPoolOpenApiConfig, createAutoPoolOpenApiDocument, registerOpenApiJsonRoute, type CrudService, type HttpMethod, type RouteContext, type RouteDefinition, type RouteHandler, type CreateOpenApiDocumentOptions, type OpenApiDocument, type OpenApiServer, type AutoPoolOpenApiConfig, type RegisterOpenApiJsonRouteOptions, };
export declare const createExpressRouter: typeof createExpressRouterImpl;
export declare const registerFastifyRoutes: typeof registerFastifyRoutesImpl;
export declare function createAutoPoolExpressRouter(db: AutoPoolDB, options?: AutoPoolServerOptions): Promise<any>;
export declare function registerAutoPoolFastifyRoutes(fastify: any, db: AutoPoolDB, options?: AutoPoolServerOptions): Promise<void>;
export type { AutoPoolDB } from "../core/types.js";
//# sourceMappingURL=index.d.ts.map