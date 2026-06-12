#!/usr/bin/env node
import { createAutoPool } from "./init.js";
const KNOWN_ENVS = new Set(["development", "production", "test"]);
function printHelp() {
    console.log(`
Usage:
  stock-pro-ims -development
  stock-pro-ims -production
  stock-pro-ims -test

Options:
  -development          Use development config
  -production           Use production config
  -test                 Use test config
  --env <name>          Use any custom config key
  --config <path>       Use a specific config JSON file
  --no-sync             Register models and authenticate without creating tables
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
    return { env, configPath, sync };
}
async function main() {
    const options = parseArgs(process.argv.slice(2));
    await createAutoPool({
        env: options.env,
        configPath: options.configPath,
        sync: options.sync,
    });
    console.log(`stock-pro-ims models initialized for "${options.env}"`);
}
main().catch((error) => {
    console.error("Error initializing stock-pro-ims:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
