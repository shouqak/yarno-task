import React, { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@mui/material"
import { useApp } from "../../context/AppContext"
import { IoIosMenu, IoMdMoon, IoMdSettings } from "react-icons/io"
import { FiSun } from "react-icons/fi"
import { FaUsers } from "react-icons/fa6"
import { IoStatsChartSharp } from "react-icons/io5"
import Logo from "../../assets/Logo.png"
const drawerWidth = 240

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleTheme, currentUser, signOut } = useApp()
  const first = (currentUser && currentUser.firstName) || ""
  const last = (currentUser && currentUser.lastName) || ""
  const name =
    (first + " " + last).trim() || (currentUser && currentUser.email) || "Guest"
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const items = [
    { label: "Users", to: "/dashboard/users", icon: <FaUsers /> },
    {
      label: "Activity",
      to: "/dashboard/activity",
      icon: <IoStatsChartSharp />,
    },
    { label: "Settings", to: "/dashboard/settings", icon: <IoMdSettings /> },
  ]

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
        >
          Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {items.map((item) => {
          const selected = location.pathname === item.to
          return (
            <ListItem
              key={item.to}
              disablePadding
            >
              <ListItemButton
                selected={selected}
                onClick={() => navigate(item.to)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
        }}
        color="inherit"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              <IoIosMenu />
            </span>
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            Welcome, {name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            aria-label="toggle theme"
            onClick={toggleTheme}
          >
            {mode === "dark" ? <IoMdMoon /> : <FiSun color="#ffc107" />}
          </IconButton>
          <Button
            onClick={() => {
              signOut()
              navigate("/")
            }}
            size="small"
            variant="outlined"
            sx={{
              ml: 1,
              textTransform: "none",
              color: "red",
              borderColor: "red",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.1)",
                borderColor: "darkred",
              },
            }}
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
