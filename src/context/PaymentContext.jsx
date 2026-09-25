import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  apiFetchPayments,
  apiCreatePayment,
  apiUpdatePaymentStatus,
  apiProcessRefund,
  calculatePaymentStats,
} from '../services/paymentApi'

const PaymentContext = createContext(null)

export function PaymentProvider({ children }) {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch payments on initial mount
  const loadPayments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchPayments()
      setPayments(data)
    } catch (err) {
      console.error('Failed to load payments:', err)
      setError(err.message || 'Unable to load payment records.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  // Computed summary metrics
  const stats = useMemo(() => {
    return calculatePaymentStats(payments)
  }, [payments])

  // Create a new payment record
  const addPayment = async (paymentData) => {
    const created = await apiCreatePayment(paymentData)
    setPayments((prev) => [created, ...prev])
    return created
  }

  // Update payment status (e.g. Paid, Pending, Failed, Refunded)
  const updateStatus = async (id, newStatus, extraDetails = {}) => {
    const updated = await apiUpdatePaymentStatus(id, newStatus, extraDetails)
    setPayments((prev) =>
      prev.map((p) => (String(p.id) === String(id) || String(p.invoiceNumber) === String(id) ? updated : p))
    )
    return updated
  }

  // Process a refund
  const issueRefund = async (id, amount, reason) => {
    const updated = await apiProcessRefund(id, amount, reason)
    setPayments((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)))
    return updated
  }

  // Get payment by transaction ID or invoice number
  const getPaymentById = useCallback(
    (id) => {
      return payments.find(
        (p) => String(p.id).toLowerCase() === String(id).toLowerCase() ||
               String(p.invoiceNumber).toLowerCase() === String(id).toLowerCase()
      )
    },
    [payments]
  )

  // Get payment by linked Booking ID
  const getPaymentByBookingId = useCallback(
    (bookingId) => {
      return payments.find(
        (p) => String(p.bookingId).toLowerCase() === String(bookingId).toLowerCase()
      )
    },
    [payments]
  )

  const value = {
    payments,
    stats,
    isLoading,
    error,
    loadPayments,
    addPayment,
    updateStatus,
    issueRefund,
    getPaymentById,
    getPaymentByBookingId,
  }

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
}

export function usePayments() {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error('usePayments must be used within a PaymentProvider')
  }
  return context
}
