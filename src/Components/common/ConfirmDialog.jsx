import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose?.()}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()}>{cancelText}</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onConfirm?.()}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
