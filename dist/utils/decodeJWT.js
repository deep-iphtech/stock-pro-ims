import { jwtDecode } from "jwt-decode";
export function getTokenInfo(token) {
    try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true;
        return {
            valid: !isExpired,
            expired: isExpired,
            data: decoded, // payload info (id, role, etc.)
        };
    }
    catch (err) {
        return {
            valid: false,
            expired: true,
            data: null,
            error: "Invalid token",
        };
    }
}
