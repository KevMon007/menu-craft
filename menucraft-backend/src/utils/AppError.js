// src/utils/AppError.js
//
// Clase de error personalizada. Permite lanzar errores desde cualquier
// controller/middleware con un statusCode explícito, y marca el error
// como "operacional" (esperado) vs. un bug interno no controlado.

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // Error esperado (validación, 404, 403, etc.)
    this.details = details;    // Info adicional opcional (ej: campos inválidos)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;