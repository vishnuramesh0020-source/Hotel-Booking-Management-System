import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { RoomProvider } from './context/RoomContext'
import { GuestProvider } from './context/GuestContext'
import { BookingProvider } from './context/BookingContext'
import { PaymentProvider } from './context/PaymentContext'
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicRoute from './components/routes/PublicRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import RoomList from './pages/rooms/RoomList'
import RoomDetails from './pages/rooms/RoomDetails'
import GuestList from './pages/guests/GuestList'
import GuestProfile from './pages/guests/GuestProfile'
import BookingList from './pages/bookings/BookingList'
import CheckInOutHub from './pages/checkin/CheckInOutHub'
import PaymentList from './pages/payments/PaymentList'
import BookingHistory from './pages/history/BookingHistory'

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <GuestProvider>
          <BookingProvider>
            <PaymentProvider>
              <Router>
              <Routes>
              {/* Public Auth Routes (Redirects to /dashboard if already logged in) */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              {/* Protected Area (Requires authenticated session) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <RoomList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms/:id"
                element={
                  <ProtectedRoute>
                    <RoomDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guests"
                element={
                  <ProtectedRoute>
                    <GuestList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guests/:id"
                element={
                  <ProtectedRoute>
                    <GuestProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkin-checkout"
                element={
                  <ProtectedRoute>
                    <CheckInOutHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <PaymentList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-history"
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirections */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Global Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Router>
          </PaymentProvider>
          </BookingProvider>
        </GuestProvider>
      </RoomProvider>
    </AuthProvider>
  )
}
