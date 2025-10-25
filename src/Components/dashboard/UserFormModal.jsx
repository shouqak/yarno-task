import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material"
import toast from "react-hot-toast"

export default function UserFormModal({ open, onClose, onSubmit, initial }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initial)
      setValues({
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        email: initial.email || "",
        password: "",
      })
    else setValues({ firstName: "", lastName: "", email: "", password: "" })
  }, [initial, open])

  const handleSubmit = async () => {
    if (!values.firstName || !values.lastName || !values.email) {
      toast.error("Please fill first name, last name, and email")
      return
    }
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(values.email)
    if (!emailOk) {
      toast.error("Please enter a valid email address")
      return
    }
    const isEdit = Boolean(initial)
    const pass = values.password?.toString() || ""
    if (!isEdit) {
      if (!pass || pass.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
    } else if (pass && pass.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    }
    if (!isEdit || pass) payload.password = pass

    setSubmitting(true)
    try {
      await onSubmit(payload)
      onClose?.(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => onClose?.()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{initial ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          sx={{ mt: 1 }}
        >
          <TextField
            label="First Name"
            value={values.firstName}
            onChange={(e) =>
              setValues((v) => ({ ...v, firstName: e.target.value }))
            }
          />
          <TextField
            label="Last Name"
            value={values.lastName}
            onChange={(e) =>
              setValues((v) => ({ ...v, lastName: e.target.value }))
            }
          />
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
          />
          <TextField
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => {
              setValues((v) => ({ ...v, password: e.target.value }))
              if (passwordError) setPasswordError("")
            }}
            helperText={initial ? "Leave blank to keep current password" : ""}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
