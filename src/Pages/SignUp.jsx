import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Logo from "../assets/Logo.png"
import { useState } from "react"
import { api } from "../services/api"
import { useNavigate } from "react-router"
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

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const firstName = data.get("firstName")?.toString().trim()
    const lastName = data.get("lastName")?.toString().trim()
    const email = data.get("email")?.toString().trim()
    const password = data.get("password")?.toString()

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all required fields.")
      return
    }

    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.")
      return
    }

    try {
      setLoading(true)
      await api.post("/users", { firstName, lastName, email, password })
      toast.success("Account created successfully. Redirecting to Sign In...")
      setTimeout(() => navigate("/"), 1200)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Sign up failed. Please try again."
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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Sign up to get started with your dashboard
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <StyledTextField
                required
                fullWidth
                placeholder="First Name"
                name="firstName"
                autoComplete="given-name"
                sx={{ mb: 2 }}
              />
              <StyledTextField
                required
                fullWidth
                placeholder="Last Name"
                name="lastName"
                autoComplete="family-name"
                sx={{ mb: 2 }}
              />
              <StyledTextField
                required
                fullWidth
                placeholder="Enter your email address"
                name="email"
                autoComplete="email"
                sx={{ mb: 2 }}
              />
              <StyledTextField
                required
                fullWidth
                name="password"
                placeholder="Create your password"
                type="password"
                autoComplete="new-password"
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
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
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Link
                  href="/"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
