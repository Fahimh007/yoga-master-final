import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";
import InstructorsProfile from "../pages/Instructors/InstructorsProfile";
import Classes from "../pages/Classes/Classes";
import SingleClass from "../pages/Classes/SingleClass";
import NotFound from "../pages/NotFound";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import UserProfile from "../pages/user/UserProfile";
import DashbordLayout from "../layout/DashbordLayout";
import Dashbord from "../pages/Dashbord/Dashbord";
import DashboardTest from "../pages/DashboardTest";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/instructors",
        element: <Instructors />,
      },
      {
        path: "/instructor/:id",
        element: <InstructorsProfile />,
      },
      {
        path: "/user-profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/classes",
        element: <Classes />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: '/class/:id',
        element: <SingleClass/>
      },
      {
        path: '/dashboard-test',
        element: <DashboardTest/>
      }
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashbordLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashbord/>
      }
    ],
  }
]);
