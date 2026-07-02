export declare function objectSchema(properties: Record<string, unknown>, required?: string[], example?: Record<string, unknown>): {
    example?: Record<string, unknown> | undefined;
    required?: string[] | undefined;
    type: string;
    properties: Record<string, unknown>;
};
