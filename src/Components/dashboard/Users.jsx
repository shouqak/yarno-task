import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  CircularProgress,
  Fab,
  Tooltip,
  IconButton,
} from "@mui/material"
import SearchBar from "../common/SearchBar"
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api"
import UserFormModal from "./UserFormModal"
import ConfirmDialog from "../common/ConfirmDialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"
import { FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Fill } from "react-icons/ri"
import {
  MdFirstPage,
  MdLastPage,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"

function TablePagerActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    onPageChange(event, lastPage)
  }

  const atStart = page === 0
  const atEnd = page >= Math.ceil(count / rowsPerPage) - 1 || count === 0

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={atStart}
        aria-label="first page"
        size="small"
      >
        <MdFirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={atStart}
        aria-label="previous page"
        size="small"
      >
        <MdChevronLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={atEnd}
        aria-label="next page"
        size="small"
      >
        <MdChevronRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={atEnd}
        aria-label="last page"
        size="small"
      >
        <MdLastPage />
      </IconButton>
    </Box>
  )
}

export default function Users() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [order, setOrder] = useState("asc")
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    setError("")
    try {
      const { data, total } = await listUsers({
        page: page + 1,
        limit: rowsPerPage,
        search,
        sortBy,
        order,
      })
      setRows(data)
      setTotal(total)
    } catch (e) {
      setError(e?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, sortBy, order])

  // On search change, go to first page or refetch if already there
  useEffect(() => {
    if (page !== 0) setPage(0)
    else fetchData()
  }, [search])

  const handleCreate = async (values) => {
    const payload = { ...values }
    await createUser(payload)
    toast.success("User created")
    fetchData()
  }

  const handleUpdate = async (values) => {
    const payload = { ...values }
    await updateUser(editing.id, payload)
    toast.success("User updated")
    fetchData()
  }

  const handleDelete = async () => {
    if (!confirm.id) return
    await deleteUser(confirm.id)
    setConfirm({ open: false, id: null })
    toast.success("User deleted")
    if (rows.length === 1 && page > 0) {
      setPage((p) => Math.max(0, p - 1))
    } else {
      fetchData()
    }
  }

  const handleSort = (key) => {
    if (sortBy === key) setOrder((o) => (o === "asc" ? "desc" : "asc"))
    else {
      setSortBy(key)
      setOrder("asc")
    }
  }

  // Rely on server-side filtering/sorting/pagination
  const displayRows = useMemo(() => rows, [rows])

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700 }}
        >
          Users
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: 520 } }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search users..."
          />
          <Button
            variant="contained"
            onClick={() => {
              setEditing(null)
              setOpenForm(true)
            }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            New
          </Button>
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{ p: 2 }}
      >
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Chip
              label={`Sort: ${sortBy}`}
              onClick={() => handleSort("firstName")}
            />
            <Chip
              label={order.toUpperCase()}
              onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
            />
          </Stack>

          {loading ? (
            <Stack
              alignItems="center"
              sx={{ py: 6 }}
            >
              <CircularProgress />
            </Stack>
          ) : error ? (
            <Typography
              color="error"
              sx={{ p: 2 }}
            >
              {error}
            </Typography>
          ) : (
            <>
              <Table
                size="small"
                sx={{ minWidth: 600 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSort("id")}
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                        cursor: "pointer",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("firstName")}
                      sx={{ cursor: "pointer" }}
                    >
                      First Name
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("lastName")}
                      sx={{ cursor: "pointer" }}
                    >
                      Last Name
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("email")}
                      sx={{ cursor: "pointer" }}
                    >
                      Email
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  component={motion.tbody}
                  layout
                >
                  <AnimatePresence initial={false}>
                    {displayRows.map((row) => (
                      <TableRow
                        key={row.id}
                        component={motion.tr}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        hover
                      >
                        <TableCell
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          {row.id}
                        </TableCell>
                        <TableCell
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/dashboard/users/${row.id}`)}
                        >
                          {row.firstName}
                        </TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Button
                              size="small"
                              color="warning"
                              onClick={() => {
                                setEditing(row)
                                setOpenForm(true)
                              }}
                            >
                              <FaPenToSquare />
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                setConfirm({ open: true, id: row.id })
                              }
                            >
                              <RiDeleteBin5Fill />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ "& .MuiTablePagination-toolbar": { flexWrap: "wrap" } }}
                ActionsComponent={TablePagerActions}
              />
            </>
          )}
        </Box>
      </Paper>

      <UserFormModal
        open={openForm}
        initial={editing}
        onClose={() => setOpenForm(false)}
        onSubmit={(vals) => (editing ? handleUpdate(vals) : handleCreate(vals))}
      />
      <ConfirmDialog
        open={confirm.open}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </Box>
  )
}
