type NormalizedError = {
    statusCode: number;
    payload: {
        success: false;
        error: string;
        message: string | {
            field: string;
            message: string;
        }[];
    };
};
export declare function normalizeError(error: unknown): NormalizedError;
export {};
