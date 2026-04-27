import api from './api';

const ITEMS_BASE = '/items';

function normalizeDonation(d) {
  const requests = Array.isArray(d.requests) ? [...d.requests] : [];
  return { ...d, requests };
}

/**
 * GET /items — list all items (browse / admin context).
 */
export async function getDonations(params = {}) {
  const { data } = await api.get(ITEMS_BASE, { params });
  return Array.isArray(data) ? data.map(normalizeDonation) : data;
}

/**
 * POST /items — create item (payload: title, description, category, quantity, location).
 */
export async function createItem(payload) {
  const { data } = await api.post(ITEMS_BASE, payload);
  return normalizeDonation(data);
}

/**
 * PATCH /items/:id — workflow updates (status, assignedToId).
 */
export async function patchItem(id, payload) {
  const { data } = await api.patch(`${ITEMS_BASE}/${id}`, payload);
  return normalizeDonation(data);
}

/**
 * GET /items/my — current user's donations.
 */
export async function getMyDonations() {
  const { data } = await api.get(`${ITEMS_BASE}/my`);
  return Array.isArray(data) ? data.map(normalizeDonation) : data;
}
