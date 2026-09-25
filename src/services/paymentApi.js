/**
 * Payments & Invoicing API Service
 * Manages hotel payment ledger, invoice generation, GST tax breakdowns, and transaction history.
 */

const PAYMENTS_STORAGE_KEY = 'hbms_payments'

// Seed payment transactions linked to initial bookings
const INITIAL_PAYMENTS = [
  {
    id: 'TXN-2026-8801',
    invoiceNumber: 'INV-2026-1041',
    bookingId: 'HTL-BK-2026-9021',
    guestId: '1',
    guestName: 'Emily Johnson',
    guestEmail: 'emily.johnson@x.dummyjson.com',
    guestPhone: '+81 965-431-3024',
    guestAddress: '456 Oak Avenue, Tokyo, Japan',
    guestIdProof: '977-175',
    roomId: '1',
    roomNumber: '101',
    roomType: 'Deluxe King Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-28',
    nights: 4,
    ratePerNight: 8500,
    subtotal: 34000,
    cgst: 2040, // 6%
    sgst: 2040, // 6%
    taxAmount: 4080, // 12%
    extraCharges: 0,
    extraChargesDetails: '',
    totalAmount: 38080,
    amountPaid: 38080,
    refundedAmount: 0,
    paymentMethod: 'UPI',
    paymentMethodDetails: 'UPI / emily@okhdfcbank',
    paymentGatewayRef: 'RZP_pay_9021001',
    status: 'Paid',
    transactionDate: '2026-09-24T10:35:00.000Z',
    dueDate: '2026-09-24T23:59:59.000Z',
    notes: 'Advance booking payment settled via Google Pay UPI.',
    receivedBy: 'David Miller (Front Desk)',
    createdAt: '2026-09-20T10:30:00.000Z',
  },
  {
    id: 'TXN-2026-8802',
    invoiceNumber: 'INV-2026-1042',
    bookingId: 'HTL-BK-2026-9022',
    guestId: '2',
    guestName: 'Michael Williams',
    guestEmail: 'michael.williams@x.dummyjson.com',
    guestPhone: '+49 258-627-6644',
    guestAddress: '12 Berlin Strasse, Munich, Germany',
    guestIdProof: '912-602',
    roomId: '3',
    roomNumber: '103',
    roomType: 'Executive Balcony Suite',
    checkIn: '2026-09-25',
    checkOut: '2026-09-27',
    nights: 2,
    ratePerNight: 14500,
    subtotal: 29000,
    cgst: 1740,
    sgst: 1740,
    taxAmount: 3480,
    extraCharges: 0,
    extraChargesDetails: '',
    totalAmount: 32480,
    amountPaid: 0,
    refundedAmount: 0,
    paymentMethod: 'Credit Card',
    paymentMethodDetails: 'Mastercard ending in 5541 (Pending on Arrival)',
    paymentGatewayRef: 'AUTH_HOLD_9022',
    status: 'Pending',
    transactionDate: '2026-09-21T14:15:00.000Z',
    dueDate: '2026-09-25T14:00:00.000Z',
    notes: 'Credit card hold pre-authorized. Balance payable upon check-in.',
    receivedBy: 'Front Desk System',
    createdAt: '2026-09-21T14:15:00.000Z',
  },
  {
    id: 'TXN-2026-8803',
    invoiceNumber: 'INV-2026-1043',
    bookingId: 'HTL-BK-2026-9023',
    guestId: '3',
    guestName: 'Sophia Brown',
    guestEmail: 'sophia.brown@x.dummyjson.com',
    guestPhone: '+81 210-652-2785',
    guestAddress: '78 Sakura Boulevard, Kyoto, Japan',
    guestIdProof: '963-113',
    roomId: '4',
    roomNumber: '201',
    roomType: 'Ocean Penthouse',
    checkIn: '2026-09-22',
    checkOut: '2026-09-24',
    nights: 2,
    ratePerNight: 24500,
    subtotal: 49000,
    cgst: 2940,
    sgst: 2940,
    taxAmount: 5880,
    extraCharges: 1200,
    extraChargesDetails: 'Mini-bar beverages (₹1,200)',
    totalAmount: 56080,
    amountPaid: 56080,
    refundedAmount: 0,
    paymentMethod: 'Credit Card',
    paymentMethodDetails: 'Visa Corporate Card ending in 4012',
    paymentGatewayRef: 'POS_SWIPE_201_9023',
    status: 'Paid',
    transactionDate: '2026-09-24T11:05:00.000Z',
    dueDate: '2026-09-24T11:00:00.000Z',
    notes: 'Checkout folio closed. Room tariff + ₹1,200 minibar settled at desk terminal.',
    receivedBy: 'Sarah Connor (Front Desk)',
    createdAt: '2026-09-19T09:00:00.000Z',
  },
  {
    id: 'TXN-2026-8804',
    invoiceNumber: 'INV-2026-1044',
    bookingId: 'HTL-BK-2026-9024',
    guestId: '4',
    guestName: 'James Miller',
    guestEmail: 'james.miller@x.dummyjson.com',
    guestPhone: '+1 202-555-0143',
    guestAddress: '100 Pennsylvania Ave NW, Washington DC, USA',
    guestIdProof: 'IDP-4821',
    roomId: '5',
    roomNumber: '202',
    roomType: 'Presidential Royal Suite',
    checkIn: '2026-09-28',
    checkOut: '2026-10-02',
    nights: 4,
    ratePerNight: 38000,
    subtotal: 152000,
    cgst: 9120,
    sgst: 9120,
    taxAmount: 18240,
    extraCharges: 0,
    extraChargesDetails: '',
    totalAmount: 170240,
    amountPaid: 170240,
    refundedAmount: 0,
    paymentMethod: 'Net Banking',
    paymentMethodDetails: 'HDFC Corporate Net Banking (UTR: HDFC890212)',
    paymentGatewayRef: 'NB_HDFC_991823',
    status: 'Paid',
    transactionDate: '2026-09-22T17:00:00.000Z',
    dueDate: '2026-09-28T14:00:00.000Z',
    notes: 'Full prepayment received via corporate direct transfer.',
    receivedBy: 'Accounts Dept',
    createdAt: '2026-09-22T16:45:00.000Z',
  },
  {
    id: 'TXN-2026-8805',
    invoiceNumber: 'INV-2026-1045',
    bookingId: 'HTL-BK-2026-9018',
    guestId: '5',
    guestName: 'Alexander Hayes',
    guestEmail: 'alexander.hayes@x.dummyjson.com',
    guestPhone: '+44 7911 123456',
    guestAddress: '15 Canary Wharf, London, UK',
    guestIdProof: 'GB-992144',
    roomId: '2',
    roomNumber: '102',
    roomType: 'Executive Suite',
    checkIn: '2026-09-18',
    checkOut: '2026-09-20',
    nights: 2,
    ratePerNight: 12000,
    subtotal: 24000,
    cgst: 1440,
    sgst: 1440,
    taxAmount: 2880,
    extraCharges: 0,
    extraChargesDetails: '',
    totalAmount: 26880,
    amountPaid: 0,
    refundedAmount: 26880,
    paymentMethod: 'Credit Card',
    paymentMethodDetails: 'American Express ending in 1004',
    paymentGatewayRef: 'REFUND_AMEX_8805',
    status: 'Refunded',
    transactionDate: '2026-09-17T11:20:00.000Z',
    dueDate: '2026-09-18T14:00:00.000Z',
    notes: 'Guest cancelled 24 hours prior due to flight cancellation. 100% refund credited.',
    receivedBy: 'Finance / Accounts Desk',
    createdAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'TXN-2026-8806',
    invoiceNumber: 'INV-2026-1046',
    bookingId: 'HTL-BK-2026-9019',
    guestId: '6',
    guestName: 'Liam Chen',
    guestEmail: 'liam.chen@x.dummyjson.com',
    guestPhone: '+65 6789 0123',
    guestAddress: '8 Marina View, Singapore',
    guestIdProof: 'SG-81923',
    roomId: '1',
    roomNumber: '101',
    roomType: 'Deluxe King Suite',
    checkIn: '2026-09-21',
    checkOut: '2026-09-22',
    nights: 1,
    ratePerNight: 8500,
    subtotal: 8500,
    cgst: 510,
    sgst: 510,
    taxAmount: 1020,
    extraCharges: 0,
    extraChargesDetails: '',
    totalAmount: 9520,
    amountPaid: 0,
    refundedAmount: 0,
    paymentMethod: 'UPI',
    paymentMethodDetails: 'UPI / liam@okaxis',
    paymentGatewayRef: 'TXN_FAIL_UPI_TIMEOUT',
    status: 'Failed',
    transactionDate: '2026-09-21T09:12:00.000Z',
    dueDate: '2026-09-21T10:00:00.000Z',
    notes: 'Gateway transaction timeout from issuing bank. Awaiting re-attempt.',
    receivedBy: 'Payment Gateway Webhook',
    createdAt: '2026-09-21T09:10:00.000Z',
  },
]

/**
 * Initialize storage with default payments if empty
 */
function initPaymentsStorage() {
  try {
    const existing = localStorage.getItem(PAYMENTS_STORAGE_KEY)
    if (!existing) {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS))
      return INITIAL_PAYMENTS
    }
    return JSON.parse(existing)
  } catch (err) {
    console.error('Failed to init payments storage:', err)
    return INITIAL_PAYMENTS
  }
}

/**
 * Fetch all payments
 */
export async function apiFetchPayments() {
  // Simulate brief async network delay
  await new Promise((resolve) => setTimeout(resolve, 80))
  const payments = initPaymentsStorage()
  return payments
}

/**
 * Save all payments to localStorage
 */
function savePayments(payments) {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments))
  } catch (err) {
    console.error('Failed to save payments to localStorage:', err)
  }
}

/**
 * Generate a new invoice number sequence
 */
export function generateInvoiceNumber(existingCount = 0) {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `INV-${year}-${1040 + existingCount + randomSuffix % 100}`
}

/**
 * Generate a new transaction ID
 */
export function generateTransactionId() {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `TXN-${year}-${randomSuffix}`
}

/**
 * Create a new payment record (e.g., when booking created or settled)
 */
export async function apiCreatePayment(paymentData) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const currentPayments = initPaymentsStorage()

  const subtotal = Number(paymentData.subtotal || paymentData.totalAmount || 0)
  const tax = Number(paymentData.tax || Math.round(subtotal * 0.12))
  const extraCharges = Number(paymentData.extraCharges || 0)
  const totalAmount = subtotal + tax + extraCharges

  const newPayment = {
    id: generateTransactionId(),
    invoiceNumber: generateInvoiceNumber(currentPayments.length),
    bookingId: paymentData.bookingId || `HTL-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    guestId: paymentData.guestId || '',
    guestName: paymentData.guestName || 'Valued Guest',
    guestEmail: paymentData.guestEmail || '',
    guestPhone: paymentData.guestPhone || '',
    guestAddress: paymentData.guestAddress || 'Registered Guest Address',
    guestIdProof: paymentData.guestIdProof || 'Govt Verified ID',
    roomId: paymentData.roomId || '',
    roomNumber: paymentData.roomNumber || 'Room',
    roomType: paymentData.roomType || 'Hotel Suite',
    checkIn: paymentData.checkIn || new Date().toISOString().split('T')[0],
    checkOut: paymentData.checkOut || new Date().toISOString().split('T')[0],
    nights: Number(paymentData.nights || 1),
    ratePerNight: Number(paymentData.pricePerNight || paymentData.ratePerNight || 0),
    subtotal,
    cgst: Math.round(tax / 2),
    sgst: Math.round(tax / 2),
    taxAmount: tax,
    extraCharges,
    extraChargesDetails: paymentData.extraChargesDetails || '',
    totalAmount,
    amountPaid: paymentData.status === 'Paid' ? totalAmount : Number(paymentData.amountPaid || 0),
    refundedAmount: 0,
    paymentMethod: paymentData.paymentMethod || 'Credit Card',
    paymentMethodDetails: paymentData.paymentMethodDetails || `${paymentData.paymentMethod || 'Card'} Transaction`,
    paymentGatewayRef: paymentData.paymentGatewayRef || `GATEWAY_${Date.now()}`,
    status: paymentData.status || 'Pending',
    transactionDate: new Date().toISOString(),
    dueDate: paymentData.dueDate || new Date().toISOString(),
    notes: paymentData.notes || 'Reservation charges generated.',
    receivedBy: paymentData.receivedBy || 'Front Desk Operations',
    createdAt: new Date().toISOString(),
  }

  const updatedList = [newPayment, ...currentPayments]
  savePayments(updatedList)
  return newPayment
}

/**
 * Update payment status (e.g. Mark as Paid, Failed, or Refunded)
 */
export async function apiUpdatePaymentStatus(id, newStatus, updateDetails = {}) {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const currentPayments = initPaymentsStorage()

  const index = currentPayments.findIndex((p) => String(p.id) === String(id) || String(p.invoiceNumber) === String(id))
  if (index === -1) {
    throw new Error(`Payment record #${id} not found.`)
  }

  const current = currentPayments[index]
  const updated = {
    ...current,
    status: newStatus,
    amountPaid: newStatus === 'Paid' ? current.totalAmount : current.amountPaid,
    paymentMethod: updateDetails.paymentMethod || current.paymentMethod,
    paymentMethodDetails: updateDetails.paymentMethodDetails || current.paymentMethodDetails,
    notes: updateDetails.notes || current.notes,
    receivedBy: updateDetails.receivedBy || current.receivedBy,
    transactionDate: new Date().toISOString(),
    ...updateDetails,
  }

  currentPayments[index] = updated
  savePayments(currentPayments)
  return updated
}

/**
 * Process a refund for a payment
 */
export async function apiProcessRefund(id, refundAmount, reason = '') {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const currentPayments = initPaymentsStorage()

  const index = currentPayments.findIndex((p) => String(p.id) === String(id))
  if (index === -1) {
    throw new Error(`Payment record #${id} not found.`)
  }

  const current = currentPayments[index]
  const amount = Number(refundAmount) || current.totalAmount

  const updated = {
    ...current,
    status: 'Refunded',
    refundedAmount: amount,
    amountPaid: Math.max(0, current.amountPaid - amount),
    notes: `Refund processed: ₹${amount.toLocaleString()} - ${reason || 'Customer request / Cancellation'}`,
    transactionDate: new Date().toISOString(),
  }

  currentPayments[index] = updated
  savePayments(currentPayments)
  return updated
}

/**
 * Calculate Payment KPIs & Summaries
 */
export function calculatePaymentStats(payments = []) {
  const totalTransactions = payments.length
  const paidPayments = payments.filter((p) => p.status === 'Paid')
  const pendingPayments = payments.filter((p) => p.status === 'Pending')
  const refundedPayments = payments.filter((p) => p.status === 'Refunded')
  const failedPayments = payments.filter((p) => p.status === 'Failed')

  const totalCollected = paidPayments.reduce((acc, p) => acc + Number(p.amountPaid || p.totalAmount || 0), 0)
  const totalPending = pendingPayments.reduce((acc, p) => acc + Number(p.totalAmount || 0), 0)
  const totalRefunded = refundedPayments.reduce((acc, p) => acc + Number(p.refundedAmount || p.totalAmount || 0), 0)
  const totalGrossInvoiced = payments.reduce((acc, p) => acc + Number(p.totalAmount || 0), 0)

  const successRate = totalTransactions > 0
    ? Number(((paidPayments.length / totalTransactions) * 100).toFixed(1))
    : 100

  // Payment Method Breakdown
  const methodCounts = {
    UPI: 0,
    'Credit Card': 0,
    'Debit Card': 0,
    'Net Banking': 0,
    Cash: 0,
  }

  const methodAmounts = {
    UPI: 0,
    'Credit Card': 0,
    'Debit Card': 0,
    'Net Banking': 0,
    Cash: 0,
  }

  payments.forEach((p) => {
    const m = p.paymentMethod || 'Credit Card'
    const amt = Number(p.totalAmount || 0)
    if (m.includes('UPI')) {
      methodCounts['UPI'] += 1
      methodAmounts['UPI'] += amt
    } else if (m.includes('Debit')) {
      methodCounts['Debit Card'] += 1
      methodAmounts['Debit Card'] += amt
    } else if (m.includes('Card') || m.includes('Visa') || m.includes('Mastercard')) {
      methodCounts['Credit Card'] += 1
      methodAmounts['Credit Card'] += amt
    } else if (m.includes('Net') || m.includes('Banking')) {
      methodCounts['Net Banking'] += 1
      methodAmounts['Net Banking'] += amt
    } else if (m.includes('Cash')) {
      methodCounts['Cash'] += 1
      methodAmounts['Cash'] += amt
    } else {
      methodCounts['Credit Card'] += 1
      methodAmounts['Credit Card'] += amt
    }
  })

  return {
    totalTransactions,
    paidCount: paidPayments.length,
    pendingCount: pendingPayments.length,
    refundedCount: refundedPayments.length,
    failedCount: failedPayments.length,
    totalCollected,
    totalPending,
    totalRefunded,
    totalGrossInvoiced,
    successRate,
    methodCounts,
    methodAmounts,
  }
}

/**
 * Hotelook Corporate & Billing Details
 */
export const HOTEL_BILLING_INFO = {
  name: 'Hotelook Luxury Resorts & Suites',
  tagline: 'Exquisite Hospitality & Comfort',
  legalEntity: 'Hotelook Hospitality India Private Limited',
  gstin: '29AAAAA0000A1Z5',
  pan: 'AAAAA0000A',
  sacCode: '996311', // Accommodation and food serving services
  address: 'Plot 42, Palm Beach Boulevard, Seaside District, Mumbai, Maharashtra - 400001, India',
  phone: '+91 (022) 4590-7700',
  email: 'billing@hotelook.com',
  website: 'www.hotelook.com',
  taxRatePercent: 12,
  currency: '₹',
}
