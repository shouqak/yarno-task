# Yarno Dashboard 

Admin-style dashboard with authentication, users management, activity timeline, and responsive UI. Built with React, Vite, Material UI, React Router, and Axios. Includes optional animations via Framer Motion.

website : https://yarno-task.netlify.app/

## Features

- Auth: Sign up, Sign in, Sign out (state persisted to `localStorage`)
- Users CRUD with modal form, search, sort, pagination, details page
- Activity page with filters (type, date range, search) and timeline list
- Responsive layout (drawer, cards, tables), light/dark theme toggle
- Framer Motion animations on lists/timeline 

## About the Project

- Purpose: a practical starter dashboard showcasing auth, master–detail flows, list filtering, and responsive design patterns.
- Architecture: React Router nested routes, a shared `DashboardLayout`, and a small context (`AppContext`) for theme + current user state.
- Data model: `users` (profile fields) and `activities` (type, userId, createdAt). Activities include a client-side fallback if the endpoint is missing.
- UI/UX: Material UI components with custom styling; tables for dense data and a timeline list for activity; mobile-friendly stacks and scrolling tables.
- API layer: Axios instance in `src/services/api.` with helpers (list/create/update/delete). Honors environment base URL.
- Extensibility: plug a real auth backend, add route guards (protected routes), expand activity analytics, and introduce tests as you scale.

## Tech Stack

- React 19, Vite, React Router 7
- Material UI 7, React Icons, React Hot Toast
- Axios for API calls
- Framer Motion

```
mockapi : https://6875177fdd06792b9c96ba28.mockapi.io (/users , /activities )

```

## Paths of Interest

- Routing: `src/Router/Router`
- Layout: `src/Components/layout/DashboardLayout`
- Users: `src/Components/dashboard/Users`, `src/Components/dashboard/UserFormModal`, `src/Components/dashboard/UserDetails`
- Activity: `src/Components/dashboard/Activity`
- Theme/Context: `src/theme.`, `src/context/AppContext`

