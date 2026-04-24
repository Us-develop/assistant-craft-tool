#!/usr/bin/env tsx
/**
 * Runs the Drizzle migrations against the MySQL instance configured in .env.
 * Usage:
 *   npm run db:generate   # produces SQL files from the schema
 *   npm run db:migrate    # applies them to the configured DB
 */
import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import path from "node:path";

async function main(): Promise<void> {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error(
      "Missing DB_HOST / DB_USER / DB_NAME env vars — copy .env.example to .env.local first.",
    );
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    multipleStatements: true,
  });

  const db = drizzle(connection);
  await migrate(db, {
    migrationsFolder: path.resolve(process.cwd(), "src/drizzle/migrations"),
  });

  await connection.end();
  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
