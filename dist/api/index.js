import { buildAutoPoolRoutes } from "./routes.js";
import { HttpError, createExpressRouter as createExpressRouterImpl, createCrudRoutes, executeRoute, registerExpressRoutes, registerFastifyRoutes as registerFastifyRoutesImpl, } from "./http.js";
import { createAutoPoolOpenApiDocument, createAutoPoolOpenApiConfig, registerOpenApiJsonRoute, } from "./openapi.js";
import { scalarHtml } from "../utils/scalarHtml.js";
export { buildAutoPoolRoutes, createCrudRoutes, executeRoute, HttpError, registerExpressRoutes, createAutoPoolOpenApiConfig, createAutoPoolOpenApiDocument, registerOpenApiJsonRoute, };
export const createExpressRouter = createExpressRouterImpl;
export const registerFastifyRoutes = registerFastifyRoutesImpl;
export async function createAutoPoolExpressRouter(db, options = {}) {
    const defaultPath = options.prefixPath ?? "/api";
    const router = await createExpressRouterImpl(db, buildAutoPoolRoutes(db, defaultPath), options.preHandler);
    const openApi = createAutoPoolOpenApiConfig({
        prefixPath: defaultPath,
        openApiPath: options.openApiPath,
        openApi: options.openApi,
    });
    registerOpenApiJsonRoute(router, openApi.document, {
        path: openApi.path,
    });
    router.get(`${defaultPath}/ims-storyboard`, (_request, response) => {
        response.type("text/html").send(scalarHtml(openApi.path));
    });
    return router;
}
export async function registerAutoPoolFastifyRoutes(fastify, db, options = {}) {
    const defaultPath = options.prefixPath ?? "/api";
    registerFastifyRoutesImpl(fastify, db, buildAutoPoolRoutes(db, defaultPath), options.preHandler);
    const openApi = createAutoPoolOpenApiConfig({
        prefixPath: defaultPath,
        openApiPath: options.openApiPath,
        openApi: options.openApi,
    });
    registerOpenApiJsonRoute(fastify, openApi.document, {
        path: openApi.path,
    });
    fastify.get(`${defaultPath}/ims-storyboard`, (_request, reply) => {
        return reply.type("text/html").send(scalarHtml(openApi.path));
    });
}
