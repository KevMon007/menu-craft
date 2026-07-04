// src/utils/asyncHandler.js
//
// Envuelve un controller async: si la promesa rechaza (o lanza),
// el error se pasa automáticamente a next(err) -> middleware global.
// Evita repetir try/catch en cada controller.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;