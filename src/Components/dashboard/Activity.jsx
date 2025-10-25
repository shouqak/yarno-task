import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Button,
} from "@mui/material"
import { listActivities, listUsers } from "../../services/api"
import { useNavigate } from "react-router"
import SearchBar from "../common/SearchBar"
import StatsCard from "../common/StatsCard"
import { IoTrendingUp } from "react-icons/io5"
import { FaPlus } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

export default function Activity() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [type, setType] = useState("")
  const [search, setSearch] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [usersMap, setUsersMap] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await listUsers({ page: 1, limit: 1000 })
        const map = {}
        data.forEach((u) => {
          map[String(u.id)] = u
        })
        setUsersMap(map)
      } catch {}
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError("")
      try {
        // Build local start/end-of-day
        const fromObj = fromDate ? new Date(`${fromDate}T00:00:00`) : null
        let toObj = toDate ? new Date(`${toDate}T23:59:59.999`) : null
        if (fromObj && toObj && fromObj > toObj) {
          toObj = new Date(fromObj)
          toObj.setHours(23, 59, 59, 999)
        }
        const fromISO = fromObj ? fromObj.toISOString() : undefined
        const toISO = toObj ? toObj.toISOString() : undefined
        const { data } = await listActivities({
          limit: 50,
          type: type || undefined,
          from: fromISO,
          to: toISO,
        })
        setItems(data)
      } catch (e) {
        setError(e?.message || "Failed to load activity")
      } finally {
        setLoading(false)
      }
    })()
  }, [type, fromDate, toDate])

  const filtered = useMemo(() => {
    // Build local date boundaries

    const start = fromDate ? new Date(`${fromDate}T00:00:00`) : null
    let end = toDate ? new Date(`${toDate}T23:59:59.999`) : null
    if (start && end && start > end) end = new Date(start.getTime() + 86399999)

    return items.filter((i) => {
      const q = search.toLowerCase()
      if (q) {
        const user = usersMap[String(i.userId)]
        const fullName = user
          ? `${user.firstName || ""} ${user.lastName || ""}`
              .trim()
              .toLowerCase()
          : ""
        const typeMatch = (i.type || "").toLowerCase().includes(q)
        const nameMatch = fullName.includes(q)
        if (!typeMatch && !nameMatch) return false
      }

      // Date range filter (local time)
      if (start || end) {
        const created = new Date(i.createdAt || Date.now())
        if (start && created < start) return false
        if (end && created > end) return false
      }
      return true
    })
  }, [items, search, usersMap, fromDate, toDate])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach((a) => {
      const d = new Date(a.createdAt || Date.now())
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    return Object.entries(map)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => ({ date, items }))
  }, [filtered])

  const [summaryCounts, setSummaryCounts] = useState({
    total: 0,
    create: 0,
    update: 0,
    delete: 0,
    login: 0,
  })
  const [summaryDeltas, setSummaryDeltas] = useState({
    total: 0,
    create: 0,
    update: 0,
    delete: 0,
  })

 

  const [last7Days, setLast7Days] = useState({ labels: [], values: [] })

  const weeklyDiffs = useMemo(
    () => ({ counts: summaryCounts, deltas: summaryDeltas }),
    [summaryCounts, summaryDeltas]
  )

  const colorForType = (t) => {
    const k = (t || "").toLowerCase()
    if (k === "create") return "success"
    if (k === "update") return "warning"
    if (k === "delete") return "error"
    if (k === "login") return "info"
    return "default"
  }

  // Fetch summary (This Week vs Previous Week) and baseline last-7-days from mock API
  useEffect(() => {
    ;(async () => {
      const end = new Date()
      const startThis = new Date()
      startThis.setDate(end.getDate() - 6)
      const endPrev = new Date(startThis)
      endPrev.setDate(startThis.getDate() - 1)
      const startPrev = new Date(endPrev)
      startPrev.setDate(endPrev.getDate() - 6)

      const inRange = (d, s, e) => {
        const dt = new Date(d)
        return dt >= s && dt <= e
      }

      const fetchAll = async (t) => {
        const r = await listActivities({ type: t, page: 1, limit: 1000 })
        return Array.isArray(r.data) ? r.data : []
      }

      const [all, creates, updates, deletes, logins] = await Promise.all([
        fetchAll(undefined),
        fetchAll("create"),
        fetchAll("update"),
        fetchAll("delete"),
        fetchAll("login"),
      ])

      const countRange = (arr, s, e) =>
        arr.filter((a) => a.createdAt && inRange(a.createdAt, s, e)).length
      const pct = (a, b) => (b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100)

      const totalThis = countRange(all, startThis, end)
      const totalPrev = countRange(all, startPrev, endPrev)
      const createThis = countRange(creates, startThis, end)
      const createPrev = countRange(creates, startPrev, endPrev)
      const updateThis = countRange(updates, startThis, end)
      const updatePrev = countRange(updates, startPrev, endPrev)
      const deleteThis = countRange(deletes, startThis, end)
      const deletePrev = countRange(deletes, startPrev, endPrev)
      const loginThis = countRange(logins, startThis, end)

      setSummaryCounts({
        total: totalThis,
        create: createThis,
        update: updateThis,
        delete: deleteThis,
        login: loginThis,
      })
      setSummaryDeltas({
        total: pct(totalThis, totalPrev),
        create: pct(createThis, createPrev),
        update: pct(updateThis, updatePrev),
        delete: pct(deleteThis, deletePrev),
      })
    })()
  }, [])

  // Recompute last-7-days bars by selected type (All/type)
  useEffect(() => {
    ;(async () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 6)
      const arr = await (async () => {
        const r = await listActivities({
          type: type || undefined,
          page: 1,
          limit: 1000,
        })
        return Array.isArray(r.data) ? r.data : []
      })()
      const labels = []
      const values = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        const wd = d.toLocaleDateString(undefined, { weekday: "short" })
        labels.push(`${wd} ${d.getDate()}`)
        values.push(
          arr.filter((a) => (a.createdAt || "").slice(0, 10) === key).length
        )
      }
      setLast7Days({ labels, values })
    })()
  }, [type])

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatsCard
            title="Total Activities"
            value={weeklyDiffs.counts.total}
            delta={weeklyDiffs.deltas.total}
            icon={<IoTrendingUp color="blue" />}
            iconBg="#E8F2FF"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatsCard
            title="Create Actions"
            value={weeklyDiffs.counts.create}
            delta={weeklyDiffs.deltas.create}
            icon={<FaPlus color="green" />}
            iconBg="#EAF7EE"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatsCard
            title="Update Actions"
            value={weeklyDiffs.counts.update}
            delta={weeklyDiffs.deltas.update}
            icon={<FaEdit color="orange" />}
            iconBg="#fff9c7"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatsCard
            title="Delete Actions"
            value={weeklyDiffs.counts.delete}
            delta={weeklyDiffs.deltas.delete}
            icon={<MdDelete color="red" />}
            iconBg="#FFECEC"
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Activity
          </Typography>
          <Grid
            container
            spacing={1}
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <SearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch("")}
                placeholder="Filter activity..."
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={3}
            >
              <TextField
                type="date"
                label="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={3}
            >
              <TextField
                type="date"
                label="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch("")
                  setType("")
                  setFromDate("")
                  setToDate("")
                }}
                size="small"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1, flexWrap: "wrap" }}
      >
        {["", "login", "update", "create", "delete"].map((t) => (
          <Chip
            key={t || "all"}
            label={t || "All"}
            color={t === type ? "primary" : "default"}
            variant={t === type ? "filled" : "outlined"}
            size="small"
            onClick={() => setType(t)}
          />
        ))}
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {loading ? (
          <Stack
            alignItems="center"
            sx={{ py: 6 }}
          >
            <CircularProgress />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence initial={false}>
              {grouped.map((group) => {
                const label = new Date(group.date).toLocaleDateString(
                  undefined,
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
                return (
                  <Box
                    key={group.date}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      {label}
                    </Typography>
                    <Stack
                      spacing={1}
                      component={motion.div}
                      layout
                    >
                      {group.items.map((a) => {
                        const u = usersMap[String(a.userId)]
                        const name = u
                          ? `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                            u.email ||
                            `User #${a.userId}`
                          : `User #${a.userId}`
                        return (
                          <Box
                            key={a.id}
                            component={motion.div}
                            layout
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                            sx={{
                              position: "relative",
                              pl: 2,
                              borderLeft: "2px solid",
                              borderColor: "divider",
                              p: 1,
                              borderRadius: 1,
                              transition:
                                "background-color 150ms, transform 150ms",
                              "&:hover": {
                                bgcolor: "action.hover",
                                transform: "translateX(2px)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: -7,
                                top: { xs: 12, sm: 10 },
                                width: { xs: 10, sm: 8 },
                                height: { xs: 10, sm: 8 },
                                bgcolor: "primary.main",
                                borderRadius: "50%",
                                boxShadow: (t) =>
                                  `0 0 0 4px ${t.palette.background.paper}`,
                              }}
                            />
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                            >
                              <Chip
                                size="small"
                                color={colorForType(a.type)}
                                label={a.type || "activity"}
                                variant={
                                  colorForType(a.type) === "default"
                                    ? "outlined"
                                    : "filled"
                                }
                              />
                              <Typography color="text.secondary">
                                {new Date(
                                  a.createdAt || Date.now()
                                ).toLocaleString()}
                              </Typography>
                              <Typography
                                sx={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                color="primary"
                                onClick={() =>
                                  navigate(`/dashboard/users/${a.userId}`)
                                }
                              >
                                {name}
                              </Typography>
                            </Stack>
                          </Box>
                        )
                      })}
                    </Stack>
                  </Box>
                )
              })}
            </AnimatePresence>
            {grouped.length === 0 && (
              <Typography color="text.secondary">No activity found.</Typography>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}
