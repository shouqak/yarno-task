import React from "react"
import { Box, TextField, InputAdornment, IconButton } from "@mui/material"
import { CiSearch } from "react-icons/ci"
import { MdClose } from "react-icons/md"

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CiSearch />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                size="small"
                aria-label="clear"
                onClick={onClear}
              >
                <MdClose />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  )
}
