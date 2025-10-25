import { createBrowserRouter, Outlet, RouterProvider } from "react-router"
import Home from "../Pages/Home"
import SignIn from "../Pages/SignIn"
import SignUp from "../Pages/SignUp"
import DashboardLayout from "../Components/layout/DashboardLayout"
import Users from "../Components/dashboard/Users"
import Activity from "../Components/dashboard/Activity"
import Settings from "../Components/dashboard/Settings"
import UserDetails from "../Components/dashboard/UserDetails"
import ProtectedRoute from "../Components/ProtectedRoute"
import ErrorPage from "../Pages/Error"



function Layout() {
  return (
    <>

      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Users /> },
          { path: "/dashboard/users", element: <Users /> },
          { path: "/dashboard/users/:id", element: <UserDetails /> },
          { path: "/dashboard/activity", element: <Activity /> },
          { path: "/dashboard/settings", element: <Settings /> },
        ],
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
])

function Router() {
  return <RouterProvider router={router} />
}

export default Router
