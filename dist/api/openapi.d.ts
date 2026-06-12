export type OpenApiServer = {
    url: string;
    description?: string;
};
export type OpenApiDocument = {
    openapi: "3.1.0";
    info: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: OpenApiServer[];
    paths: Record<string, Record<string, unknown>>;
    components: {
        schemas: Record<string, unknown>;
    };
};
export type CreateOpenApiDocumentOptions = {
    title?: string;
    version?: string;
    description?: string;
    servers?: OpenApiServer[];
    prefixPath?: string;
};
export type RegisterOpenApiJsonRouteOptions = {
    path?: string;
};
export type AutoPoolSwaggerConfig = {
    path: string;
    document: OpenApiDocument;
};
export declare function createAutoPoolOpenApiDocument(options?: CreateOpenApiDocumentOptions): OpenApiDocument;
export declare function createAutoPoolSwaggerConfig(options?: {
    prefixPath?: string;
    swaggerPath?: string;
    openApi?: CreateOpenApiDocumentOptions;
}): AutoPoolSwaggerConfig;
export declare function registerOpenApiJsonRoute(target: {
    get: (path: string, handler: (request: unknown, reply: {
        code: (statusCode: number) => {
            send: (payload: unknown) => unknown;
        };
    }) => unknown) => unknown;
} | {
    get: (path: string, handler: (request: unknown, response: {
        status: (statusCode: number) => {
            json: (payload: unknown) => unknown;
        };
    }) => unknown) => unknown;
}, document: OpenApiDocument, options?: RegisterOpenApiJsonRouteOptions): void;
//# sourceMappingURL=openapi.d.ts.map