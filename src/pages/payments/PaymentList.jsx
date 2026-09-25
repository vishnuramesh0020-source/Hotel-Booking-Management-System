import { useState, useMemo } from 'react'
import {
  CreditCard,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Building,
  Banknote,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { usePayments } from '../../context/PaymentContext'
import Navbar from '../../components/layout/Navbar'
import PaymentSummaryCards from '../../components/payments/PaymentSummaryCards'
import InvoiceModal from '../../components/payments/InvoiceModal'
import RecordPaymentModal from '../../components/payments/RecordPaymentModal'

const ITEMS_PER_PAGE = 8

export default function PaymentList() {
  const { payments, stats } = usePayments()

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedMethod, setSelectedMethod] = useState('All')
  const [selectedDateRange, setSelectedDateRange] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)

  // State for modals
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedRecordPayment, setSelectedRecordPayment] = useState(null)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        }
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
        }
      case 'Refunded':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: RotateCcw,
        }
      case 'Failed':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: XCircle,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: CheckCircle2,
        }
    }
  }

  // Payment Method icon helper
  const getMethodIcon = (method) => {
    if (!method) return CreditCard
    if (method.includes('UPI')) return QrCode
    if (method.includes('Net') || method.includes('Banking')) return Building
    if (method.includes('Cash')) return Banknote
    return CreditCard
  }

  // Filter & Search Engine
  const filteredPayments = useMemo(() => {
    let result = [...payments]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q) ||
          p.bookingId.toLowerCase().includes(q) ||
          p.guestName.toLowerCase().includes(q) ||
          (p.guestEmail && p.guestEmail.toLowerCase().includes(q)) ||
          String(p.roomNumber).toLowerCase().includes(q) ||
          (p.paymentMethodDetails && p.paymentMethodDetails.toLowerCase().includes(q))
      )
    }

    // 2. Status Filter
    if (selectedStatus !== 'All') {
      result = result.filter((p) => p.status === selectedStatus)
    }

    // 3. Payment Method Filter
    if (selectedMethod !== 'All') {
      result = result.filter((p) => {
        if (selectedMethod === 'Card') {
          return p.paymentMethod.includes('Card')
        }
        return p.paymentMethod === selectedMethod
      })
    }

    // 4. Date Range Filter
    if (selectedDateRange !== 'All') {
      const now = new Date()
      result = result.filter((p) => {
        const itemDate = new Date(p.transactionDate || p.createdAt)
        if (selectedDateRange === 'Today') {
          return itemDate.toDateString() === now.toDateString()
        }
        if (selectedDateRange === 'Week') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return itemDate >= sevenDaysAgo
        }
        if (selectedDateRange === 'Month') {
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          )
        }
        return true
      })
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.transactionDate || b.createdAt) - new Date(a.transactionDate || a.createdAt)
      }
      if (sortBy === 'date-asc') {
        return new Date(a.transactionDate || a.createdAt) - new Date(b.transactionDate || b.createdAt)
      }
      if (sortBy === 'amount-desc') {
        return Number(b.totalAmount) - Number(a.totalAmount)
      }
      if (sortBy === 'amount-asc') {
        return Number(a.totalAmount) - Number(b.totalAmount)
      }
      return 0
    })

    return result
  }, [payments, searchQuery, selectedStatus, selectedMethod, selectedDateRange, sortBy])

  // Pagination Logic
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredPayments, currentPage])

  // Reset pagination on filter change
  const handleFilterChange = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  // Quick Row Download Invoice Trigger
  const handleQuickDownload = (payment) => {
    toast.info(`Downloading Invoice ${payment.invoiceNumber}...`, {
      icon: '📥',
      autoClose: 1500,
    })
    setTimeout(() => {
      const slip = `HOTELOOK TAX INVOICE: ${payment.invoiceNumber}\nGuest: ${payment.guestName}\nRoom: #${payment.roomNumber}\nTotal Amount: INR ${payment.totalAmount}\nStatus: ${payment.status}\nDate: ${payment.transactionDate}`
      const blob = new Blob([slip], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice_${payment.invoiceNumber}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Invoice ${payment.invoiceNumber} downloaded!`)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Top Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1b4332]/10 text-[#1b4332]">
                GST Tax Folio System
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Payment Ledger & Invoicing
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Review transaction histories, generate itemized luxury GST tax folios, and process guest billing settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (filteredPayments.length > 0) {
                  setSelectedInvoicePayment(filteredPayments[0])
                  setIsInvoiceModalOpen(true)
                }
              }}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Latest Folio</span>
            </button>
          </div>
        </div>

        {/* Payment Summary KPI Cards */}
        <PaymentSummaryCards stats={stats} />

        {/* Filter & Search Control Panel */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Txn ID, Invoice No, Booking Ref, Guest Name, or Room..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Status:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
                {['All', 'Paid', 'Pending', 'Refunded', 'Failed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(setSelectedStatus, status)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedStatus === status
                        ? 'bg-[#1b4332] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Filters: Payment Method, Date Range, Sort */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Payment Method Filter */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Method:</span>
                <select
                  value={selectedMethod}
                  onChange={(e) => handleFilterChange(setSelectedMethod, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
                >
                  <option value="All">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Cards (Credit/Debit)</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Period:</span>
                <select
                  value={selectedDateRange}
                  onChange={(e) => handleFilterChange(setSelectedDateRange, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Week">Last 7 Days</option>
                  <option value="Month">This Month</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(selectedStatus !== 'All' || selectedMethod !== 'All' || selectedDateRange !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedStatus('All')
                    setSelectedMethod('All')
                    setSelectedDateRange('All')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-bold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-semibold text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment History Ledger Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment & Invoicing History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredPayments.length} transactions recorded in the system
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b4332]/5 border-b border-slate-200/70 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Invoice / Transaction ID</th>
                  <th className="px-5 py-3.5">Guest & Room</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Payment Channel</th>
                  <th className="px-5 py-3.5 text-right">Amount (₹)</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment) => {
                    const badge = getStatusBadge(payment.status)
                    const StatusIcon = badge.icon
                    const MethodIcon = getMethodIcon(payment.paymentMethod)

                    return (
                      <tr key={payment.id} className="hover:bg-slate-50/80 transition group">
                        
                        {/* 1. Invoice & Txn ID */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <span className="font-mono font-black text-slate-900 text-xs block">
                              {payment.invoiceNumber}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 block">
                              Txn: {payment.id}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                              Ref: {payment.bookingId}
                            </span>
                          </div>
                        </td>

                        {/* 2. Guest & Room */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900 text-xs">{payment.guestName}</p>
                            <p className="text-[11px] text-slate-500">
                              Room #{payment.roomNumber} • {payment.nights} {payment.nights === 1 ? 'night' : 'nights'}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {payment.roomType}
                            </p>
                          </div>
                        </td>

                        {/* 3. Date & Time */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800">
                              {new Date(payment.transactionDate || payment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {new Date(payment.transactionDate || payment.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </td>

                        {/* 4. Payment Channel */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                              <MethodIcon className="w-3.5 h-3.5 text-[#1b4332]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{payment.paymentMethod}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                {payment.paymentMethodDetails || 'Direct Settlement'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 5. Amount */}
                        <td className="px-5 py-4 text-right">
                          <div className="space-y-0.5 font-mono">
                            <span className="text-sm font-black text-[#1b4332] block">
                              ₹{Number(payment.totalAmount).toLocaleString()}
                            </span>
                            {payment.extraCharges > 0 && (
                              <span className="text-[10px] text-amber-700 block">
                                +₹{Number(payment.extraCharges).toLocaleString()} extras
                              </span>
                            )}
                            {payment.refundedAmount > 0 && (
                              <span className="text-[10px] text-purple-700 block font-semibold">
                                Refund: ₹{Number(payment.refundedAmount).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Status */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{payment.status}</span>
                          </span>
                        </td>

                        {/* 7. Action Controls */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Official Invoice */}
                            <button
                              onClick={() => {
                                setSelectedInvoicePayment(payment)
                                setIsInvoiceModalOpen(true)
                              }}
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-[#1b4332] transition cursor-pointer"
                              title="View GST Tax Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Download Receipt */}
                            <button
                              onClick={() => handleQuickDownload(payment)}
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-[#1b4332] transition cursor-pointer"
                              title="Download Dummy PDF Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Record / Update Status */}
                            <button
                              onClick={() => {
                                setSelectedRecordPayment(payment)
                                setIsRecordModalOpen(true)
                              }}
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-[#1b4332] hover:bg-slate-100 transition cursor-pointer"
                              title="Update Payment Status"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-base font-bold text-slate-800">No payment transactions found</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        No invoices match your selected status, payment method, or search criteria.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedStatus('All')
                          setSelectedMethod('All')
                          setSelectedDateRange('All')
                          setSearchQuery('')
                        }}
                        className="mt-4 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] transition cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing{' '}
                <strong>
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredPayments.length)} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)}
                </strong>{' '}
                of <strong>{filteredPayments.length}</strong> transactions
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#1b4332] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Official Tax Invoice Folio Modal (Feature: Invoice Generation & Download UI) */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false)
          setSelectedInvoicePayment(null)
        }}
        payment={selectedInvoicePayment}
      />

      {/* Record Payment / Status Modal (Feature: Payment Status Update) */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false)
          setSelectedRecordPayment(null)
        }}
        payment={selectedRecordPayment}
      />
    </div>
  )
}
