import {
  mysqlTable,
  bigint,
  varchar,
  text,
  json,
  timestamp,
  index,
  unique,
} from "drizzle-orm/mysql-core";
import type { WizardData } from "@/lib/wizardSchema";

/**
 * `submissions` — one row per completed wizard submission.
 *
 * Design notes:
 * - `data` is a JSON column holding the entire WizardData payload. That way
 *   the schema can evolve without migrations.
 * - Frequently-queried fields (`assistantName`, `domain`, `language`) are also
 *   denormalized into their own columns so the admin list can sort/filter
 *   without parsing JSON on every row.
 * - `generatedPrompt` is stored as TEXT for easy grepping/export.
 */
export const submissions = mysqlTable(
  "submissions",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    language: varchar("language", { length: 8 }).notNull(),
    assistantName: varchar("assistant_name", { length: 160 }),
    domain: varchar("domain", { length: 160 }),
    jobTitle: varchar("job_title", { length: 320 }),
    data: json("data").$type<WizardData>().notNull(),
    generatedPrompt: text("generated_prompt").notNull(),
    kickoffMessage: text("kickoff_message"),
    charCount: bigint("char_count", { mode: "number", unsigned: true }).notNull(),
    tenantSlug: varchar("tenant_slug", { length: 32 }).notNull().default("demo"),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 500 }),
  },
  (table) => ({
    createdAtIdx: index("submissions_created_at_idx").on(table.createdAt),
    domainIdx: index("submissions_domain_idx").on(table.domain),
    languageIdx: index("submissions_language_idx").on(table.language),
    tenantSlugIdx: index("submissions_tenant_slug_idx").on(table.tenantSlug),
  }),
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

/**
 * `prompt_shares` — public read-only share links for the generated system prompt
 * (created from the result screen). Short token in the URL, no auth.
 */
export const promptShares = mysqlTable("prompt_shares", {
  token: varchar("token", { length: 32 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  tenantSlug: varchar("tenant_slug", { length: 32 }).notNull().default("demo"),
  language: varchar("language", { length: 8 }).notNull(),
  assistantName: varchar("assistant_name", { length: 160 }),
  generatedPrompt: text("generated_prompt").notNull(),
  kickoffMessage: text("kickoff_message"),
});

export type PromptShareRow = typeof promptShares.$inferSelect;

/**
 * `tenant_users` — per-tenant access grants managed by admins.
 * Each row gives one email address access to one tenant.
 */
export const tenantUsers = mysqlTable(
  "tenant_users",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    tenantSlug: varchar("tenant_slug", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 255 }),
  },
  (table) => ({
    emailTenantUniq: unique("email_tenant_uniq").on(table.email, table.tenantSlug),
    emailIdx: index("tenant_users_email_idx").on(table.email),
  }),
);

export type TenantUser = typeof tenantUsers.$inferSelect;
export type NewTenantUser = typeof tenantUsers.$inferInsert;
