import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import Notifications from "./pages/Notifications/Notifications";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/feed", element: <Feed /> },
  { path: "/profile", element: <Profile /> },
  { path: "/notifications", element: <Notifications /> },
]);

export default function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}