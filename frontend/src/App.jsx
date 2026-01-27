import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Smart Route Component to handle root path logic
const RootRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    return <Dashboard />;
  }

  return <Navigate to="/books" replace />;
};

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Book";
import AddBook from "./pages/AddBook";
import DeleteBook from "./pages/DeleteBook";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MyBooks from "./pages/MyBooks";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmationProvider } from "./context/ConfirmationContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmationProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/books" element={<Books />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/my-books"
                element={
                  <ProtectedRoute>
                    <MyBooks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-book"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddBook />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/delete-book"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DeleteBook />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Catch all - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ConfirmationProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
