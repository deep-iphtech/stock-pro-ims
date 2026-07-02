export type OpenApiServer = {
    url: string;
    description?: string;
};
export type OpenApiTag = {
    name: string;
    description?: string;
};
export declare const queryParam: (name: string, description: string, required?: boolean, schema?: Record<string, unknown>) => {
    name: string;
    in: string;
    required: boolean;
    description: string;
    schema: Record<string, unknown>;
};
export type OpenApiDocument = {
    openapi: "3.1.0";
    info: {
        title: string;
        version: string;
        description?: string;
    };
    tags?: OpenApiTag[];
    servers?: OpenApiServer[];
    paths: Record<string, Record<string, unknown>>;
    components: {
        reqSchemas: Record<string, unknown>;
        resSchemas: Record<string, unknown>;
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
export type AutoPoolOpenApiConfig = {
    path: string;
    document: OpenApiDocument;
};
export declare const pathParam: (name: string, description: string, schema?: Record<string, any>) => {
    name: string;
    in: string;
    required: boolean;
    description: string;
    schema: Record<string, any>;
};
export declare function createAutoPoolOpenApiDocument(options?: CreateOpenApiDocumentOptions): OpenApiDocument;
export declare function createAutoPoolOpenApiConfig(options?: {
    prefixPath?: string;
    openApiPath?: string;
    openApi?: CreateOpenApiDocumentOptions;
}): AutoPoolOpenApiConfig;
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
