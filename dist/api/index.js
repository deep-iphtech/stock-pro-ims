import { buildAutoPoolRoutes } from "./routes.js";
import { HttpError, createExpressRouter as createExpressRouterImpl, createCrudRoutes, executeRoute, registerExpressRoutes, registerFastifyRoutes as registerFastifyRoutesImpl, } from "./http.js";
import { createAutoPoolSwaggerConfig, createAutoPoolOpenApiDocument, registerOpenApiJsonRoute, } from "./openapi.js";
export { buildAutoPoolRoutes, createCrudRoutes, executeRoute, HttpError, registerExpressRoutes, createAutoPoolSwaggerConfig, createAutoPoolOpenApiDocument, registerOpenApiJsonRoute, };
export const createExpressRouter = createExpressRouterImpl;
export const registerFastifyRoutes = registerFastifyRoutesImpl;
export async function createAutoPoolExpressRouter(db, options = {}) {
    const defaultPath = options.prefixPath ?? "/api";
    const router = await createExpressRouterImpl(db, buildAutoPoolRoutes(db, defaultPath), options.preHandler);
    if (options.swagger) {
        const swagger = createAutoPoolSwaggerConfig({
            prefixPath: defaultPath,
            swaggerPath: options.swaggerPath,
            openApi: options.openApi,
        });
        registerOpenApiJsonRoute(router, swagger.document, {
            path: swagger.path,
        });
        const swaggerUi = await import("swagger-ui-express");
        router.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger.document));
    }
    return router;
}
export async function registerAutoPoolFastifyRoutes(fastify, db, options = {}) {
    const defaultPath = options.prefixPath ?? "/api";
    registerFastifyRoutesImpl(fastify, db, buildAutoPoolRoutes(db, defaultPath), options.preHandler);
    if (options.swagger) {
        const swaggerConfig = createAutoPoolSwaggerConfig({
            prefixPath: defaultPath,
            swaggerPath: options.swaggerPath,
            openApi: options.openApi,
        });
        registerOpenApiJsonRoute(fastify, swaggerConfig.document, {
            path: swaggerConfig.path,
        });
        const swagger = await import("@fastify/swagger");
        const swaggerUi = await import("@fastify/swagger-ui");
        await fastify.register(swagger.default ?? swagger, {
            openapi: swaggerConfig.document,
        });
        await fastify.register(swaggerUi.default ?? swaggerUi, {
            routePrefix: "/api/docs",
        });
    }
}
