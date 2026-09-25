import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { RoomProvider } from './context/RoomContext'
import { GuestProvider } from './context/GuestContext'
import { BookingProvider } from './context/BookingContext'
import { PaymentProvider } from './context/PaymentContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RoomProvider>
        <GuestProvider>
          <BookingProvider>
            <PaymentProvider>
              <App />
            </PaymentProvider>
          </BookingProvider>
        </GuestProvider>
      </RoomProvider>
    </AuthProvider>
  </StrictMode>,
)
