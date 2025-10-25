import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router";
import { useApp } from "../context/AppContext";

export default function ErrorPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const routeError = useRouteError();

  const title = (() => {
    if (routeError && typeof routeError === "object" && "status" in routeError) {
      const anyErr = routeError;
      const status = anyErr.status;
      if (status === 404) return "Page Not Found";
      if (status === 401) return "Unauthorized";
      if (status === 500) return "Server Error";
    }
    return "Something went wrong";
  })();

  const goPrimary = () => {
    if (currentUser) navigate("/dashboard");
    else navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <dotlottie-player
            src="https://lottie.host/d623e9a4-5b8d-430b-a595-445c40cf19fa/I7uIvZSKN3.lottie"
            loop
            autoplay
            style={{ width: 360, height: 360 }}
          />
        </Box>

        <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 56 }, fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you’re looking for doesn’t exist or an error occurred.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={goPrimary}>
            {currentUser ? "Go to Dashboard" : "Go to Sign In"}
          </Button>
          <Button variant="outlined" onClick={goBack}>Go Back</Button>
        </Stack>
      </Box>
    </Container>
  );
}

