import React, { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router"
import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Chip,
  Button,
  Divider,
  IconButton,
} from "@mui/material"
import { getUser, listActivities } from "../../services/api"
import { IoIosArrowBack } from "react-icons/io"

function MockActivityChart({ values = [] }) {
  const max = Math.max(1, ...values)
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={0.5}
      sx={{ height: 80 }}
    >
      {values.map((v, i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: `${(v / max) * 100}%`,
            bgcolor: "primary.main",
            borderRadius: 1,
          }}
        />
      ))}
    </Stack>
  )
}

export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [u, acts] = await Promise.all([
          getUser(id),
          listActivities({ userId: id, limit: 10 }).then((r) => r.data),
        ])
        if (!active) return
        setUser(u)
        setActivities(acts)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  if (loading)
    return (
      <Stack
        alignItems="center"
        sx={{ py: 6 }}
      >
        <CircularProgress />
      </Stack>
    )

  if (!user) return <Typography color="error">User not found</Typography>

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase()
  const chartData = Array.from(
    { length: 24 },
    () => Math.floor(Math.random() * 10) + 1
  )

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          aria-label="Back to users"
          onClick={() => navigate("/dashboard/users")}
          size="small"
          sx={{ mr: 1 }}
        >
          <IoIosArrowBack /> 
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          User Details
        </Typography>
      </Stack>
      <Paper
        elevation={0}
        sx={{ p: 3 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Avatar
            sx={{ width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 } }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          Activity (last 24h)
        </Typography>
        <MockActivityChart values={chartData} />
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 2 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          Recent Activity
        </Typography>
        <Stack spacing={1}>
          {activities.map((a) => (
            <Stack
              key={a.id}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                }}
              />
              <Typography sx={{ fontWeight: 500 }}>
                {a.type || "activity"}
              </Typography>
              <Typography color="text.secondary">
                {new Date(a.createdAt || Date.now()).toLocaleString()}
              </Typography>
            </Stack>
          ))}
          {activities.length === 0 && (
            <Typography color="text.secondary">No recent activity.</Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
