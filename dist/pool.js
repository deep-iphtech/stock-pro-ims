import { createAutoPool } from "./init.js";
(async () => {
    try {
        const env = process.argv[2]?.replace(/^-/, "") ||
            process.env.NODE_ENV ||
            "development";
        await createAutoPool({ env, sync: true });
    }
    catch (err) {
        console.error("Error initializing database:", err);
        process.exit(1);
    }
})();
