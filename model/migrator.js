import migrationRunner from "node-pg-migrate";
import database from "infra/database.js";
import { resolve } from "node:path";

const defaultOptionsMigrate = {
  migrationsTable: "pgmigrations",
  direction: "up",
  dir: resolve("infra", "migrations"),
  dryRun: true,
  log: () => {},
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsPending = await migrationRunner({
      ...defaultOptionsMigrate,
      dbClient,
    });
    return migrationsPending;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrated = await migrationRunner({
      ...defaultOptionsMigrate,
      dbClient,
      dryRun: false,
    });
    return migrated;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
