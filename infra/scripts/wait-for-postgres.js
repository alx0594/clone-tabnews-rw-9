const { exec } = require("node:child_process");

function checkPostgress() {
  exec("docker exec postgres_rw_9 pg_isready --host=localhost", handlerStatus);

  function handlerStatus(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgress();
      return;
    }
    console.log("\n 🟢 Postgres está pronto e recebendo requisições\n\n");
  }
}

process.stdout.write("\n\n 🔴 Aguardando Postgres aceitar conexões.");
checkPostgress();
