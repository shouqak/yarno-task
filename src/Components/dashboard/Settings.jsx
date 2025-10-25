import React, { useState } from "react"
import { Box, Paper, Typography, Stack, TextField, Button } from "@mui/material"
import { useApp } from "../../context/AppContext"
import { updateAuth } from "../../services/api"
import toast from "react-hot-toast"

export default function Settings() {
  const { currentUser, setCurrentUser } = useApp()
  const [name, setname] = useState(() =>
    `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim()
  )
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name) return toast.error("Display name is required")

    if (password && password.length < 6)
      return toast.error("Password must be at least 6 characters")

    if (password && password !== confirm)
      return toast.error("Passwords do not match")

    if (!currentUser?.id) return toast.error("No signed in user")
      
    const [firstName, ...rest] = name.split(" ")
    const lastName = rest.join(" ")
    setSaving(true)
    try {
      const updated = await updateAuth(currentUser.id, {
        firstName,
        lastName,
        ...(password ? { password } : {}),
      })
      setCurrentUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
      toast.success("Settings saved")
      setPassword("")
      setConfirm("")
    } catch (e) {
      toast.error(e?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2 }}
      >
        Settings
      </Typography>
      <Paper
        elevation={0}
        sx={{ p: 3 }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Display Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave blank to keep current password"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
