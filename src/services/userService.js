import api from "./api";

const USERS_BASE = "/users";

/**
 * ✅ GET LOGISTICS USERS
 * GET /api/users/logistics
 */
export async function getLogisticsUsers() {
  try {
    const { data } = await api.get(`${USERS_BASE}/logistics`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("User API Error:", err);
    throw err;
  }
}