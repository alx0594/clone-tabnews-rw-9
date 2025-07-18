import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
} from "./error.js";

function onNoMatch(request, response) {
  const publicError = new MethodNotAllowedError();
  response.status(405).json(publicError);
}

function onError(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch,
    onError,
  },
};

export default controller;
