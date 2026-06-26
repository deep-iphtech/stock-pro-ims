import { ZodError } from "zod";
export class HttpError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
    }
}
function readNumber(value, label) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, `${label} must be a positive integer`);
    }
    return parsed;
}
function readBodyObject(body, label = "body") {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new HttpError(400, `${label} must be a JSON object`);
    }
    return body;
}
export function createCrudRoutes(options) {
    const idParam = options.idParam ?? "id";
    return [
        {
            method: "get",
            path: options.prefix,
            handler: () => options.service.findAll(),
        },
        {
            method: "get",
            path: `${options.prefix}/:${idParam}`,
            handler: ({ params }) => options.service.findById(readNumber(params[idParam], idParam)),
        },
        {
            method: "post",
            path: options.prefix,
            statusCode: 201,
            handler: (context) => {
                const body = options.createBody
                    ? options.createBody(context.body)
                    : readBodyObject(context.body);
                if (options.createHandler) {
                    return options.createHandler(body, context);
                }
                return options.service.create(body);
            },
        },
        {
            method: "put",
            path: `${options.prefix}/:${idParam}`,
            handler: ({ params, body }) => options.service.update(readNumber(params[idParam], idParam), options.updateBody ? options.updateBody(body) : readBodyObject(body)),
        },
        {
            method: "delete",
            path: `${options.prefix}/:${idParam}`,
            statusCode: 204,
            handler: async ({ params }) => {
                await options.service.delete(readNumber(params[idParam], idParam));
                return null;
            },
        },
    ];
}
export function buildRouteContext(db, request, params, query, body) {
    return {
        db,
        sequelize: db.sequelize,
        request,
        params,
        query,
        body,
    };
}
export async function executeRoute(route, db, request, params, query, body) {
    return route.handler(buildRouteContext(db, request, params, query, body));
}
function getZodStatus(error) {
    const hasMissingFields = error.issues.some((issue) => issue.code === "invalid_type" && issue.message.includes("undefined"));
    return hasMissingFields ? 400 : 422;
}
function normalizeError(error) {
    if (error instanceof HttpError) {
        return {
            statusCode: error.statusCode,
            payload: { message: error.message },
        };
    }
    if (error instanceof ZodError) {
        return {
            statusCode: getZodStatus(error),
            payload: {
                message: "Validation failed",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
        };
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return {
        statusCode: 500,
        payload: { message },
    };
}
function getHandlerStatus(route, result) {
    if (route.statusCode) {
        return route.statusCode;
    }
    if (result === null || result === undefined) {
        return 204;
    }
    return 200;
}
export function registerFastifyRoutes(fastify, db, routes, preHandler) {
    for (const route of routes) {
        fastify.route({
            method: route.method.toUpperCase(),
            url: route.path,
            ...(route.protected && preHandler ? { preHandler } : {}),
            handler: async (request, reply) => {
                try {
                    const result = await executeRoute(route, db, request, request.params ?? {}, request.query ?? {}, request.body);
                    const statusCode = getHandlerStatus(route, result);
                    if (statusCode === 204) {
                        return reply.code(204).send();
                    }
                    return reply.code(statusCode).send(result);
                }
                catch (error) {
                    const normalized = normalizeError(error);
                    return reply.code(normalized.statusCode).send(normalized.payload);
                }
            },
        });
    }
}
export function registerExpressRoutes(router, db, routes, preHandler) {
    for (const route of routes) {
        router[route.method](route.path, ...(route.protected && preHandler ? preHandler : []), async (req, res, next) => {
            try {
                const result = await executeRoute(route, db, req, req.params ?? {}, req.query ?? {}, req.body);
                const statusCode = getHandlerStatus(route, result);
                if (statusCode === 204) {
                    res.status(204).end();
                    return;
                }
                res.status(statusCode).json(result);
            }
            catch (error) {
                const normalized = normalizeError(error);
                res.status(normalized.statusCode).json(normalized.payload);
                if (normalized.statusCode === 500 && !(error instanceof HttpError)) {
                    next(error);
                }
            }
        });
    }
}
export async function createExpressRouter(db, routes, preHandler) {
    const expressModule = await import("express");
    const express = expressModule.default ?? expressModule;
    const router = express.Router();
    registerExpressRoutes(router, db, routes, preHandler);
    return router;
}
