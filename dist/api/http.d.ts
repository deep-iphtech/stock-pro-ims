import type { Sequelize } from "@sequelize/core";
import type { AutoPoolDB } from "../core/types.js";
import { Middleware } from "./index.js";
export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
export type RouteContext = {
    db: AutoPoolDB;
    sequelize: Sequelize;
    params: Record<string, string>;
    query: Record<string, unknown>;
    body: unknown;
    request: unknown;
};
export type RouteHandler = (context: RouteContext) => Promise<unknown> | unknown;
export interface RouteDefinition {
    method: HttpMethod;
    path: string;
    handler: RouteHandler;
    statusCode?: number;
    protected?: boolean;
}
export interface CrudService<T = unknown> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(data: unknown): Promise<T>;
    update(id: number, data: unknown): Promise<T>;
    delete(id: number): Promise<boolean>;
}
export declare class HttpError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare function createCrudRoutes<T>(options: {
    prefix: string;
    service: CrudService<T>;
    idParam?: string;
    createBody?: (body: unknown) => unknown;
    createHandler?: (body: unknown, context: RouteContext) => Promise<unknown> | unknown;
    updateBody?: (body: unknown) => Record<string, unknown>;
}): ({
    method: "get";
    path: string;
    handler: () => Promise<T[]>;
    statusCode?: undefined;
} | {
    method: "get";
    path: string;
    handler: ({ params }: RouteContext) => Promise<T | null>;
    statusCode?: undefined;
} | {
    method: "post";
    path: string;
    statusCode: number;
    handler: (context: RouteContext) => unknown;
} | {
    method: "put";
    path: string;
    handler: ({ params, body }: RouteContext) => Promise<{
        success: boolean;
        message: string;
    }>;
    statusCode?: undefined;
} | {
    method: "delete";
    path: string;
    statusCode: number;
    handler: ({ params }: RouteContext) => Promise<null>;
})[];
export declare function buildRouteContext(db: AutoPoolDB, request: unknown, params: Record<string, string>, query: Record<string, unknown>, body: unknown): RouteContext;
export declare function executeRoute(route: RouteDefinition, db: AutoPoolDB, request: unknown, params: Record<string, string>, query: Record<string, unknown>, body: unknown): Promise<unknown>;
export declare function registerFastifyRoutes(fastify: {
    route: (route: unknown) => unknown;
}, db: AutoPoolDB, routes: RouteDefinition[], preHandler?: Middleware[]): void;
export declare function registerExpressRoutes(router: {
    [K in HttpMethod]: (path: string, ...handlers: ((...args: any[]) => unknown)[]) => unknown;
}, db: AutoPoolDB, routes: RouteDefinition[], preHandler?: Middleware[]): void;
export declare function createExpressRouter(db: AutoPoolDB, routes: RouteDefinition[], preHandler?: Middleware[]): Promise<any>;
//# sourceMappingURL=http.d.ts.map