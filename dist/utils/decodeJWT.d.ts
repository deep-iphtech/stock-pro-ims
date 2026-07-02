export declare function getTokenInfo(token: string): {
    valid: boolean;
    expired: boolean;
    data: import("jwt-decode").JwtPayload;
    error?: undefined;
} | {
    valid: boolean;
    expired: boolean;
    data: null;
    error: string;
};
