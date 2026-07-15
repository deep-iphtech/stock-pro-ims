export function objectSchema(properties, required = [], example) {
    return {
        type: "object",
        properties,
        ...(required.length ? { required } : {}),
        ...(example ? { example } : {}),
    };
}
