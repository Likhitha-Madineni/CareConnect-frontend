import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  getLogisticsRequests,
  getLogisticsDonations,
  updateRequest,
} from "../services/requestService";

export default function LogisticsDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeStatus = (status) =>
    status?.trim()?.toUpperCase();

  const loadData = async () => {
    try {
      setLoading(true);

      const reqData = await getLogisticsRequests();   // existing
      const donationData = await getLogisticsDonations(); // 🔥 new

      const merged = [
        ...(reqData || []),

        ...(donationData || []).map((d) => ({
          ...d,
          donation: d,              // keeps UI same
          message: null,            // ensures donation section
          quantityRequested: d.quantity,
        })),
      ];

      setRequests(merged);

    } catch (err) {
      console.error("Error loading data:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateReq = async (id, status) => {
    try {
      await updateRequest(id, { status });
      await loadData();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const assignedRequests = requests.filter(
    (r) => normalizeStatus(r.status) === "ASSIGNED" && r.message
  );

  const assignedDonations = requests.filter(
    (r) => normalizeStatus(r.status) === "ASSIGNED" && !r.message
  );

  const acceptedRequests = requests.filter(
    (r) => normalizeStatus(r.status) === "ACCEPTED" && r.message
  );

  const acceptedDonations = requests.filter(
    (r) => normalizeStatus(r.status) === "ACCEPTED" && !r.message
  );

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
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f8fafc" }}>
      
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          🚚
        </Box>

        <Box>
          <Typography fontWeight={800} fontSize="1.4rem">
            Logistics Dashboard
          </Typography>
          <Typography fontSize="0.8rem" color="#64748b">
            Manage deliveries
          </Typography>
        </Box>
      </Box>

      {/* SECTIONS */}
      {[
        { title: "Assigned Requests", data: assignedRequests, type: "ASSIGNED" },
        { title: "Assigned Donations", data: assignedDonations, type: "ASSIGNED" },
        { title: "Accepted Requests", data: acceptedRequests, type: "ACCEPTED" },
        { title: "Accepted Donations", data: acceptedDonations, type: "ACCEPTED" },
      ].map((section, index) => (
        <Box key={index} mb={5}>
          <Typography
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              color: "#94a3b8",
              letterSpacing: "0.1em",
            }}
          >
            {section.title}
          </Typography>

          <Grid container spacing={2.5}>
            {section.data.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    border: "1.5px dashed #cbd5e1",
                    textAlign: "center",
                  }}
                >
                  <Typography color="#94a3b8">
                    No data available.
                  </Typography>
                </Box>
              </Grid>
            ) : (
              section.data.map((r) => (
                <Grid item xs={12} md={4} key={r.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      transition: "0.2s",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography fontWeight={700}>
                        {r.donation?.title || "No Title"}
                      </Typography>

                      {r.donation?.imageUrl && (
                        <img
                          src={r.donation.imageUrl}
                          alt="item"
                          width="100%"
                          style={{
                            marginTop: "10px",
                            borderRadius: "8px",
                          }}
                        />
                      )}

                      <Typography mt={1} color="text.secondary">
                        Quantity: {r.quantityRequested}
                      </Typography>

                      <Box mt={2}>
                        {section.type === "ASSIGNED" && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => updateReq(r.id, "ACCEPTED")}
                            >
                              Accept
                            </Button>

                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => updateReq(r.id, "REJECTED")}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {section.type === "ACCEPTED" && (
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1 }}
                            onClick={() => updateReq(r.id, "DELIVERED")}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}