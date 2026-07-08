/**
 * Consistent success response envelope used across all controllers,
 * so the frontend can rely on the same shape everywhere:
 *   { success: true, data, message }
 */
function sendSuccess(res, { statusCode = 200, data = null, message = 'OK', meta = null }) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess };
