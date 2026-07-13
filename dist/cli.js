#!/usr/bin/env node
import { createAutoPool, syncAutoPoolData } from "./init.js";
import { createAutoPoolExpressRouter, registerAutoPoolFastifyRoutes, } from "./services/index.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const KNOWN_ENVS = new Set(["development", "production", "test"]);
const KNOWN_SERVERS = new Set(["express", "fastify"]);
async function askToCreateTables() {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question("Required tables are missing. Create default Auto Pool tables? (y/N): ");
    rl.close();
    return ["y", "yes"].includes(answer.trim().toLowerCase());
}
function printHelp() {
    console.log(`
Usage:
  stock-pro-ims -development
  stock-pro-ims -production
  stock-pro-ims -test
  stock-pro-ims -server fastify
  stock-pro-ims -server express

Options:
  -development          Use development config
  -production           Use production config
  -test                 Use test config
  --env <name>          Use any custom config key
  --config <path>       Use a specific config file
  --no-sync             Register models and authenticate without creating tables
  --server <name>       Start the HTTP server (express or fastify)
  --help                Show this help
`);
}
function readValue(args, index, flag) {
    const value = args[index + 1];
    if (!value || value.startsWith("-")) {
        throw new Error(`${flag} requires a value`);
    }
    return value;
}
function parseArgs(args) {
    let env = process.env.NODE_ENV ?? "development";
    let configPath;
    let sync = true;
    let server;
    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--help" || arg === "-h") {
            printHelp();
            process.exit(0);
        }
        if (arg === "--env" || arg === "-e") {
            env = readValue(args, i, arg);
            i += 1;
            continue;
        }
        if (arg.startsWith("--env=")) {
            env = arg.slice("--env=".length);
            continue;
        }
        if (arg === "--config" || arg === "-c") {
            configPath = readValue(args, i, arg);
            i += 1;
            continue;
        }
        if (arg.startsWith("--config=")) {
            configPath = arg.slice("--config=".length);
            continue;
        }
        if (arg === "--server" || arg === "-server") {
            const value = readValue(args, i, arg);
            if (!KNOWN_SERVERS.has(value)) {
                throw new Error(`Unknown server: ${value}. Expected "express" or "fastify".`);
            }
            server = value;
            i += 1;
            continue;
        }
        if (arg.startsWith("--server=") || arg.startsWith("-server=")) {
            const value = arg.split("=", 2)[1];
            if (!KNOWN_SERVERS.has(value)) {
                throw new Error(`Unknown server: ${value}. Expected "express" or "fastify".`);
            }
            server = value;
            continue;
        }
        if (arg === "--no-sync") {
            sync = false;
            continue;
        }
        if (arg.startsWith("-") && KNOWN_ENVS.has(arg.slice(1))) {
            env = arg.slice(1);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return { env, configPath, sync, server };
}
async function startExpressServer(options) {
    const expressModule = await import("express");
    const express = expressModule.default ?? expressModule;
    const db = await createAutoPool({
        env: options.env,
        configPath: options.configPath,
        sync: options.sync,
    });
    const app = express();
    app.use(express.json());
    app.use(await createAutoPoolExpressRouter(db, {
        prefixPath: "/api",
    }));
    app.get("/", (_req, res) => res.redirect("/api/ims-storyboard"));
    const port = Number(process.env.PORT ?? 3000);
    const host = process.env.HOST;
    await new Promise((resolve, reject) => {
        const server = host
            ? app.listen(port, host, resolve)
            : app.listen(port, resolve);
        server.on("error", reject);
    });
    console.log(`Express server running at ${host ? `http://${host}:${port}` : `http://localhost:${port}`}`);
}
async function startFastifyServer(options, db) {
    const fastifyModule = await import("fastify");
    const Fastify = fastifyModule.default ?? fastifyModule;
    // const db = await createAutoPool({
    //   env: options.env,
    //   configPath: options.configPath,
    //   sync: options.sync,
    // });
    const app = Fastify({ logger: true, bodyLimit: 10 * 1024 * 1024 });
    app.get("/", async (_request, reply) => reply.redirect("/api/ims-storyboard"));
    await registerAutoPoolFastifyRoutes(app, db, {
        prefixPath: "/api",
    });
    const port = Number(process.env.PORT ?? 3005);
    const host = process.env.HOST ?? "0.0.0.0";
    await app.listen({
        host,
        port,
    });
    console.log(`Fastify server running at http://${host}:${port}`);
}
async function main() {
    const options = parseArgs(process.argv.slice(2));
    const db = await createAutoPool({
        env: options.env,
        configPath: options.configPath,
        sync: options.sync ?? false,
    });
    // ❗ handle missing tables here (CLI responsibility)
    if (!db.status.productsTableExists) {
        const shouldCreate = await askToCreateTables();
        if (!shouldCreate) {
            console.log("Aborted. Tables not created.");
            process.exit(1);
        }
        await syncAutoPoolData(true);
        console.log("Default Auto Pool tables created successfully.");
    }
    if (options.server === "express") {
        await startExpressServer(options);
        return;
    }
    if (options.server === "fastify") {
        return await startFastifyServer(options, db);
    }
    console.log(`stock-pro-ims models initialized for "${options.env}"`);
}
main().catch(async (error) => {
    console.log("error======", error);
    console.error("Error initializing stock-pro-ims:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
