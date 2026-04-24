import "server-only";
import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@/drizzle/schema";

/**
 * Lazy MySQL + Drizzle singleton.
 *
 * Why lazy: Next.js evaluates route modules at build time to collect page
 * metadata. If we created the MySQL pool at import time, the build would
 * fail whenever `.env` wasn't populated. We instead defer creation until
 * the first real request, and cache the instance on `globalThis` so hot
 * reloads in dev don't exhaust the connection limit.
 */

declare global {
  var __mysqlPool: mysql.Pool | undefined;
  var __drizzleDb: MySql2Database<typeof schema> | undefined;
}

function buildPool(): mysql.Pool {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error(
      "Missing database env vars. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env.local or your hosting panel.",
    );
  }

  return mysql.createPool({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
    // Combell's managed MySQL usually does not require SSL on the internal host.
    ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    dateStrings: false,
  });
}

export function getPool(): mysql.Pool {
  if (!globalThis.__mysqlPool) {
    globalThis.__mysqlPool = buildPool();
  }
  return globalThis.__mysqlPool;
}

export function getDb(): MySql2Database<typeof schema> {
  if (!globalThis.__drizzleDb) {
    globalThis.__drizzleDb = drizzle(getPool(), { schema, mode: "default" });
  }
  return globalThis.__drizzleDb;
}

/**
 * Convenience proxy so callers can keep writing `db.insert(...)`. Every
 * property access goes through `getDb()`, which is no more expensive than
 * the underlying `globalThis` lookup after the first call.
 */
export const db = new Proxy({} as MySql2Database<typeof schema>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
