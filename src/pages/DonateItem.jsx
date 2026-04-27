import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/itemService"; // ✅ use API

export default function DonateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    quantity: "",
    street: "",
    building: "",
    city: "",
  });

  // 🔥 NEW STATE (file)
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 FILE UPLOAD FUNCTION
  const uploadFile = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/files/upload", {
      method: "POST",
      body: formData,
    });

    return await res.text(); // backend returns URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      // 🔥 upload image first
      if (file) {
        imageUrl = await uploadFile();
      }

      await createItem({
        title: form.title.trim(),
        description: (form.description || "").trim(),
        category: form.category,
        quantity: Number(form.quantity),
        location: `${form.building}, ${form.street}, ${form.city}`, // ✅ combined
        imageUrl, // 🔥 NEW FIELD
      });

      navigate("/my-donations");
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Donate Item
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Item Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Clothes">Clothes</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Pickup Location
          </Typography>

          <TextField
            fullWidth
            label="Building / House No"
            name="building"
            value={form.building}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Street"
            name="street"
            value={form.street}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* 🔥 FILE INPUT (NEW) */}
          <Typography sx={{ mt: 2 }}>Upload Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* 🔥 OPTIONAL PREVIEW */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              width="150"
              style={{ marginTop: "10px", borderRadius: "8px" }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit Donation
          </Button>
        </form>
      </Paper>
    </Box>
  );
}