"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { login } from "../../services/login";



export default function Login() {
const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      return "Semua field wajib diisi";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Format email tidak valid";
    }

    if (form.password.length < 6) {
      return "Password minimal 6 karakter";
    }

    return "";
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  const validationError = validate();
  if (validationError) {
    setError(validationError);
    return;
  }

  setError("");
  setLoading(true);

  try {
    
    console.log(form.email)
    console.log(form.password)
    const { token, user } = await login(form.email, form.password);    

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    router.push("/monitoring");

  } catch (err) {
    setError(err.response?.data?.message || "Login gagal");
  } finally {
    setLoading(false);
  }
};

 

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Card sx={{ width: 350, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}