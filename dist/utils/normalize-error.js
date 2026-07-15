import { ZodError } from "zod";
export function normalizeError(error) {
    // Zod validation errors
    if (error instanceof ZodError) {
        return {
            statusCode: 400,
            payload: {
                success: false,
                error: "Validation Error",
                message: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
        };
    }
    // Fastify errors
    if (typeof error === "object" && error !== null && "code" in error) {
        const err = error;
        switch (err.code) {
            case "FST_ERR_CTP_INVALID_MEDIA_TYPE":
                return {
                    statusCode: 400,
                    payload: {
                        success: false,
                        error: "Bad Request",
                        message: "Request body must be valid JSON.",
                    },
                };
            default:
                return {
                    statusCode: err.statusCode ?? 500,
                    payload: {
                        success: false,
                        error: "Request Error",
                        message: err.message,
                    },
                };
        }
    }
    // Standard Error
    if (error instanceof Error) {
        return {
            statusCode: 500,
            payload: {
                success: false,
                error: "Internal Server Error",
                message: error.message,
            },
        };
    }
    // Unknown
    return {
        statusCode: 500,
        payload: {
            success: false,
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        },
    };
}
