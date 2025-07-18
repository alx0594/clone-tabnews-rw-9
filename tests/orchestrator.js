import database from "infra/database.js";
import retry from "async-retry";
import migrator from "model/migrator.js";

async function waitForAllService() {
  await waitForWebServer();

  async function waitForWebServer() {
    retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitForAllService,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
