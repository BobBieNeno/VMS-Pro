const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Thin fetch wrapper. Keeps all HTTP concerns (headers, JSON parsing,
 * error shape) in one place so components/hooks never call fetch()
 * directly - they just call getVehicles(), createVehicle(), etc.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(body?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    error.status = res.status;
    error.fieldErrors = body?.errors || null;
    throw error;
  }

  return body;
}

export function getVehicles(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/vehicles${query}`);
}

export function getVehicle(id) {
  return request(`/vehicles/${id}`);
}

export function createVehicle(payload) {
  return request('/vehicles', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateVehicle(id, payload) {
  return request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteVehicle(id) {
  return request(`/vehicles/${id}`, { method: 'DELETE' });
}
