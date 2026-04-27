import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { getMyItems, cancelItem } from "../services/itemService";

export default function MyDonations() {
  const [items, setItems] = useState([]);

  // ================= LOAD =================
  const loadItems = async () => {
    try {
      const res = await getMyItems();
      setItems(res || []); // 🔥 FIXED
    } catch (err) {
      console.error("Error loading items:", err);
      setItems([]); // 🔥 safety
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const visibleItems = items || [];

  // ================= CANCEL =================
  const handleCancel = async (id) => {
    try {
      await cancelItem(id);
      await loadItems();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "info";
      case "ASSIGNED":
        return "primary";
      case "ACCEPTED":
        return "info";
      case "DELIVERED":
        return "success";
      case "REJECTED":
        return "error";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    if (status === "CANCELLED") return "Cancelled by Donor";
    return status;
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Donations
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track the status of your donated items.
      </Typography>

      {visibleItems.length === 0 ? (
        <Typography color="text.secondary">
          You haven&apos;t listed any donations yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {visibleItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.category}
                  </Typography>

                  {item.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Chip
                      label={formatStatus(item.status)}
                      color={getStatusColor(item.status)}
                    />

                    {(item.status === "PENDING" ||
                      item.status === "APPROVED") && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancel(item.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>

                  {item.assignedTo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Assigned to: {item.assignedTo}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}