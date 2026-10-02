import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// The sample .env is at the monorepo root, including when launched from apps/api.
const envFile = resolve(__dirname, "../../../.env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;

    const key = trimmed.slice(0, separator).trim();
    if (process.env[key] !== undefined) continue;

    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

/** Runtime settings shared by the API bootstrap and the rest of the application. */
export const appConfig = Object.freeze({
  host: process.env.HOST ?? "0.0.0.0",
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
});
