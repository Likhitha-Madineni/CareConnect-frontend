import api from "./api";

const REQUESTS_BASE = "/requests";

const handleError = (err) => {
  console.error("Request API Error:", err);
};

// GET ALL REQUESTS (ADMIN)
export async function getRequests(params = {}) {
  try {
    const { data } = await api.get(REQUESTS_BASE, { params });
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return [];
  }
}

// CREATE REQUEST
export async function createRequest(payload) {
  try {
    const quantityRequested = Math.max(
      1,
      Number(payload.quantityRequested) || 1
    );

    const itemId = payload.itemId ?? payload.donationId;

    const { data } = await api.post(REQUESTS_BASE, {
      itemId,
      quantityRequested,
      message: payload.message || "",
    });

    return data;
  } catch (err) {
    handleError(err);
  }
}

// GET MY REQUESTS
export async function getMyRequests() {
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/my`);
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return [];
  }
}

// GET LOGISTICS REQUESTS
export async function getLogisticsRequests() {
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/logistics`);
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return [];
  }
}

// 🔥 THIS WAS MISSING / WRONG BEFORE
export async function getLogisticsDonations() {
  try {
    const { data } = await api.get("/items/logistics");
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    handleError(err);
    return [];
  }
}

// UPDATE REQUEST
export async function updateRequest(id, payload) {
  try {
    const { data } = await api.patch(`${REQUESTS_BASE}/${id}`, payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}