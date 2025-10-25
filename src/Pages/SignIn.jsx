import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Logo from "../assets/Logo.png"
import { useState } from "react"
import { api } from "../services/api"
import { useNavigate } from "react-router"
import { useApp } from "../context/AppContext"
import toast, { Toaster } from "react-hot-toast"

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#F7F7F7",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useApp()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get("email")?.toString().trim()
    const password = data.get("password")?.toString()

    if (!email || !password) {
      toast.error("Please enter email and password.")
      return
    }

    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)
      const res = await api.get("/users", { params: { email, password } })
      const users = Array.isArray(res.data) ? res.data : []
      if (users.length > 0) {
        localStorage.setItem("user", JSON.stringify(users[0]))
        setCurrentUser(users[0])
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        toast.error("Invalid email or password.")
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Sign in failed. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Container
        component="main"
        maxWidth="xs"
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mt: 8,
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: { xs: "70%", sm: "50%" },
                alignItems: "center",
                mx: "auto",
              }}
            >
              <img
                src={Logo}
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Sign in to access your dashboard
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <StyledTextField
                margin="normal"
                required
                fullWidth
                placeholder="Enter your email address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{ mb: 2 }}
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  mt: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link
                href="/signup"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Do not have an account? sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
