import database from "infra/database.js";
import { ValidationError } from "infra/error.js";

async function create(userInputValues) {
  await emailValidate(userInputValues.email);
  await userValidate(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function userValidate(username) {
    const results = await database.query({
      text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
       ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      const publicObjectError = new ValidationError({
        message: "O usuário já existe.",
      });
      throw publicObjectError;
    }
    return results;
  }

  async function emailValidate(email) {
    const results = await database.query({
      text: `
      SELECT 
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      const publicObjectError = new ValidationError({
        message: "O campo email já existe.",
        action: "Verificar campos inválidos.",
      });
      throw publicObjectError;
    }

    return results;
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
