import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "model/migrator.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  console.log(pendingMigrations);
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migrated = await migrator.runPendingMigrations();
  if (migrated.length > 0) {
    return response.status(201).json(migrated);
  }
  return response.status(200).json(migrated);
}
