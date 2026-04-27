import api from "./api";

const ITEMS_BASE = "/items";

const handleError = (err) => {
  console.error("Item API Error:", err);
};

// ================= GET ALL =================
export async function getAllItems() {
  try {
    const { data } = await api.get(ITEMS_BASE);
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return []; // 🔥 prevent crash
  }
}

// ================= GET MY ITEMS =================
export async function getMyItems() {
  try {
    const { data } = await api.get(`${ITEMS_BASE}/my`);
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return []; // 🔥 prevent crash
  }
}

// ================= CREATE =================
export async function createItem(payload) {
  try {
    const { data } = await api.post(ITEMS_BASE, payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

// ================= UPDATE =================
export async function updateItem(id, payload) {
  try {
    const { data } = await api.patch(`${ITEMS_BASE}/${id}`, payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

// ================= CANCEL =================
export async function cancelItem(id) {
  try {
    const { data } = await api.patch(`${ITEMS_BASE}/${id}`, {
      status: "CANCELLED",
    });
    return data;
  } catch (err) {
    handleError(err);
  }
}