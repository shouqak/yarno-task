import React from "react"
import { Paper, Stack, Typography, Box } from "@mui/material"

export default function StatsCard({
  title,
  value,
  delta = 0,
  icon = null,
  iconBg = "#EEF2FF",
}) {
  const isUp = delta > 0
  const isDown = delta < 0
  const color = isUp ? "success.main" : isDown ? "error.main" : "text.secondary"

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack spacing={0.5}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800 }}
          >
            {value?.toLocaleString?.() ?? value}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color }}
          >
            {" "}
            {isUp ? "+" : ""}
            {delta.toFixed(0)}% from last week
          </Typography>
        </Stack>
        {icon && (
          <Box
            sx={{
              bgcolor: iconBg,
              borderRadius: 2,
              p: { xs: 0.8, sm: 1.2 },
              display: "inline-flex",
            }}
          >
            <Box sx={{ fontSize: { xs: 16, sm: 20 } }}>{icon}</Box>
          </Box>
        )}
      </Stack>
    </Paper>
  )
}
