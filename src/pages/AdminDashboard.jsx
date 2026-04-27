import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import { getRequests, updateRequest } from "../services/requestService";
import { getAllItems, updateItem } from "../services/itemService";
import { getLogisticsUsers } from "../services/userService";

const sectionStyles = {
  mb: 1,
  fontWeight: 700,
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#94a3b8",
};

const statColors = {
  total: { bg: "#f0f9ff", accent: "#0ea5e9", label: "#0369a1" },
  pending: { bg: "#fffbeb", accent: "#f59e0b", label: "#92400e" },
  approved: { bg: "#f0fdf4", accent: "#22c55e", label: "#166534" },
  delivered: { bg: "#fdf4ff", accent: "#a855f7", label: "#6b21a8" },
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [logisticsUsers, setLogisticsUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [loading, setLoading] = useState(true);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);

      const reqData = await getRequests();
      setRequests(reqData || []);

      const itemData = await getAllItems();
      setItems(itemData || []);

      const users = await getLogisticsUsers();
      setLogisticsUsers(users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= ACTION =================
  const updateReq = async (id, data) => {
    await updateRequest(id, data);
    await loadData(); // 🔥 ensures instant UI update
  };

  const updateItemData = async (id, data) => {
    await updateItem(id, data);
    await loadData(); // 🔥 ensures instant UI update
  };

  // ================= FILTER =================
  const pendingReq = requests.filter((r) => r.status === "PENDING");

  // 🔥 FIXED (removed ASSIGNED)
  const approvedReq = requests.filter((r) => r.status === "APPROVED");

  const pendingItems = items.filter((i) => i.status === "PENDING");
  const approvedItems = items.filter((i) => i.status === "APPROVED");

  // ================= STATS =================
  // ================= STATS =================
const stats = {
  total: items.length + requests.length,

  pending:
    items.filter((i) => i.status === "PENDING").length +
    requests.filter((r) => r.status === "PENDING").length,

  approved:
    items.filter((i) => i.status === "APPROVED").length +
    requests.filter((r) => r.status === "APPROVED").length,

  delivered:
    items.filter((i) => i.status === "DELIVERED").length +
    requests.filter((r) => r.status === "DELIVERED").length,
};

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "#f8fafc" }}
      >
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          mb: 4,
          pb: 3,
          borderBottom: "1.5px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          🛡️
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#0f172a",
              lineHeight: 1.1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.2 }}>
            Manage donations, requests & logistics
          </Typography>
        </Box>
      </Box>

      {/* ================= STATS ================= */}
      <Grid container spacing={2.5} mb={5}>
        {Object.entries(stats).map(([key, val]) => {
          const c = statColors[key] || {
            bg: "#f1f5f9",
            accent: "#64748b",
            label: "#334155",
          };
          return (
            <Grid item xs={6} md={3} key={key}>
              <Card
                elevation={0}
                sx={{
                  background: c.bg,
                  border: `1.5px solid ${c.accent}22`,
                  borderRadius: "14px",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 24px ${c.accent}22`,
                  },
                }}
              >
                <CardContent sx={{ p: "18px !important" }}>
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: c.label,
                      mb: 0.5,
                    }}
                  >
                    {key}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: c.accent,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ================= PENDING DONATIONS ================= */}
      <Typography sx={sectionStyles}>Pending Donations</Typography>
      <Grid container spacing={2.5} mb={5}>
        {pendingItems.length === 0 && (
          <Grid item xs={12}>
            <EmptyState label="No pending donations" />
          </Grid>
        )}
        {pendingItems.map((i) => (
          <Grid item xs={12} md={4} key={i.id}>
            <Card
              elevation={0}
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: "#fff",
                transition: "box-shadow 0.18s",
                "&:hover": { boxShadow: "0 4px 20px #6366f10f" },
              }}
            >
              <CardContent sx={{ p: "20px !important" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "6px",
                    background: "#fffbeb",
                    color: "#d97706",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 1.2,
                  }}
                >
                  Pending
                </Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
                >
                  {i.title}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.3 }}
                >
                  {i.category}
                </Typography>
                <Box mt={2.5} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={approveBtn}
                    onClick={() => updateItemData(i.id, { status: "APPROVED" })}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={rejectBtn}
                    onClick={() => updateItemData(i.id, { status: "REJECTED" })}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= ASSIGN DONATIONS ================= */}
      <Typography sx={sectionStyles}>Assign Donations</Typography>
      <Grid container spacing={2.5} mb={5}>
        {approvedItems.length === 0 && (
          <Grid item xs={12}>
            <EmptyState label="No approved donations to assign" />
          </Grid>
        )}
        {approvedItems.map((i) => (
          <Grid item xs={12} md={4} key={i.id}>
            <Card
              elevation={0}
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: "#fff",
                "&:hover": { boxShadow: "0 4px 20px #6366f10f" },
                transition: "box-shadow 0.18s",
              }}
            >
              <CardContent sx={{ p: "20px !important" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "6px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 1.2,
                  }}
                >
                  Approved
                </Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
                >
                  {i.title}
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedUser[`item-${i.id}`] || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      [`item-${i.id}`]: e.target.value,
                    })
                  }
                  sx={selectStyles}
                >
                  <MenuItem value="">
                    <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                      Select Logistics
                    </em>
                  </MenuItem>
                  {logisticsUsers.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  fullWidth
                  sx={assignBtn}
                  onClick={() =>
                    updateItemData(i.id, {
                      status: "ASSIGNED",
                      assignedToId: selectedUser[`item-${i.id}`],
                    })
                  }
                >
                  Assign
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= PENDING REQUESTS ================= */}
      <Typography sx={sectionStyles}>Pending Requests</Typography>
      <Grid container spacing={2.5} mb={5}>
        {pendingReq.length === 0 && (
          <Grid item xs={12}>
            <EmptyState label="No pending requests" />
          </Grid>
        )}
        {pendingReq.map((r) => (
          <Grid item xs={12} md={4} key={r.id}>
            <Card
              elevation={0}
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: "#fff",
                "&:hover": { boxShadow: "0 4px 20px #6366f10f" },
                transition: "box-shadow 0.18s",
              }}
            >
              <CardContent sx={{ p: "20px !important" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "6px",
                    background: "#fffbeb",
                    color: "#d97706",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 1.2,
                  }}
                >
                  Pending
                </Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
                >
                  {r.donation?.title}
                </Typography>
                <Box mt={2.5} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={approveBtn}
                    onClick={() => updateReq(r.id, { status: "APPROVED" })}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={rejectBtn}
                    onClick={() => updateReq(r.id, { status: "REJECTED" })}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= ASSIGN REQUESTS ================= */}
      <Typography sx={sectionStyles}>Assign Requests</Typography>
      <Grid container spacing={2.5}>
        {approvedReq.length === 0 && (
          <Grid item xs={12}>
            <EmptyState label="No approved requests to assign" />
          </Grid>
        )}
        {approvedReq.map((r) => (
          <Grid item xs={12} md={4} key={r.id}>
            <Card
              elevation={0}
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: "#fff",
                "&:hover": { boxShadow: "0 4px 20px #6366f10f" },
                transition: "box-shadow 0.18s",
              }}
            >
              <CardContent sx={{ p: "20px !important" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "6px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 1.2,
                  }}
                >
                  Approved
                </Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
                >
                  {r.donation?.title}
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedUser[`req-${r.id}`] || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      [`req-${r.id}`]: e.target.value,
                    })
                  }
                  sx={selectStyles}
                >
                  <MenuItem value="">
                    <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                      Select Logistics
                    </em>
                  </MenuItem>
                  {logisticsUsers.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  fullWidth
                  sx={assignBtn}
                  onClick={() =>
                    updateReq(r.id, {
                      status: "ASSIGNED",
                      assignedToId: selectedUser[`req-${r.id}`],
                    })
                  }
                >
                  Assign
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ================= SHARED STYLE TOKENS =================
const approveBtn = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.78rem",
  borderRadius: "8px",
  textTransform: "none",
  px: 2,
  boxShadow: "none",
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    boxShadow: "0 4px 12px #6366f133",
  },
};

const rejectBtn = {
  border: "1.5px solid #fca5a5",
  color: "#ef4444",
  fontWeight: 700,
  fontSize: "0.78rem",
  borderRadius: "8px",
  textTransform: "none",
  px: 2,
  "&:hover": {
    background: "#fff1f1",
    border: "1.5px solid #ef4444",
  },
};

const assignBtn = {
  mt: 2,
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.82rem",
  borderRadius: "9px",
  textTransform: "none",
  boxShadow: "none",
  py: 1,
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    boxShadow: "0 4px 14px #6366f133",
  },
};

const selectStyles = {
  mt: 1.5,
  borderRadius: "9px",
  fontSize: "0.85rem",
  background: "#f8fafc",
  "& .MuiOutlinedInput-notchedOutline": { border: "1.5px solid #e2e8f0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { border: "1.5px solid #6366f1" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1.5px solid #6366f1",
  },
};

// ================= EMPTY STATE =================
function EmptyState({ label }) {
  return (
    <Box
      sx={{
        py: 3,
        px: 3,
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1.5px dashed #cbd5e1",
        textAlign: "center",
      }}
    >
      <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
        {label}
      </Typography>
    </Box>
  );
}
