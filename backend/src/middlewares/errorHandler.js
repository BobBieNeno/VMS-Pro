const ApiError = require('../utils/ApiError');

/**
 * Single place that turns any thrown error into an HTTP response.
 * Keeps controllers free of try/catch response-formatting noise.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details || null,
    });
  }

  // Unexpected/programmer errors - log for diagnostics, don't leak internals
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง',
    errors: null,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}`,
    errors: null,
  });
}

module.exports = { errorHandler, notFoundHandler };
