import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { getMyRequests } from "../services/requestService";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= STATUS CONFIG =================
  const getStatusConfig = (status) => {
    switch (status) {
      case "ASSIGNED":
        return {
          color: "#2196f3",
          icon: <LocalShippingIcon fontSize="small" />,
          text: "Assigned",
        };
      case "REJECTED":
        return {
          color: "#f44336",
          icon: <CancelIcon fontSize="small" />,
          text: "Rejected",
        };
      case "CANCELLED":
        return {
          color: "#9e9e9e",
          icon: <CancelIcon fontSize="small" />,
          text: "Cancelled",
        };
      case "DELIVERED":
        return {
          color: "#4caf50",
          icon: <CheckCircleIcon fontSize="small" />,
          text: "Delivered",
        };
      case "APPROVED":
        return {
          color: "#9c27b0",
          icon: <CheckCircleIcon fontSize="small" />,
          text: "Approved",
        };
      default:
        return {
          color: "#757575",
          icon: <AccessTimeIcon fontSize="small" />,
          text: status,
        };
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography color="text.secondary">
          No requests found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {requests.map((r) => {
            const status = getStatusConfig(r.status);

            return (
              <Grid item xs={12} key={r.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>

                    {/* TITLE */}
                    <Typography variant="h6" fontWeight="bold">
                      {r.donation?.title}
                    </Typography>

                    {/* DESCRIPTION */}
                    <Typography color="text.secondary" mt={1}>
                      {r.donation?.category} • {r.message}
                    </Typography>

                    {/* STATUS BADGE */}
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 2,
                        py: 0.7,
                        borderRadius: "20px",
                        backgroundColor: status.color,
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        mt: 2,
                      }}
                    >
                      {status.icon}
                      {status.text}
                    </Box>

                    {/* 🔥 TIMELINE */}
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Step label="Requested" active />
                      <Step label="Approved" active={["APPROVED","ASSIGNED","DELIVERED"].includes(r.status)} />
                      <Step label="Assigned" active={["ASSIGNED","DELIVERED"].includes(r.status)} />
                      <Step label="Delivered" active={r.status === "DELIVERED"} />
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

// 🔥 STEP COMPONENT
function Step({ label, active }) {
  return (
    <Box textAlign="center">
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: active ? "#4caf50" : "#ccc",
          mx: "auto",
          mb: 0.5,
        }}
      />
      <Typography
        variant="caption"
        color={active ? "text.primary" : "text.secondary"}
      >
        {label}
      </Typography>
    </Box>
  );
}