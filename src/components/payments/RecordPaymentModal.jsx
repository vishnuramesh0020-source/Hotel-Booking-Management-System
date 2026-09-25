import { useState } from 'react'
import {
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { usePayments } from '../../context/PaymentContext'

const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
]

export default function RecordPaymentModal({ isOpen, onClose, payment }) {
  const { updateStatus, issueRefund } = usePayments()

  const [status, setStatus] = useState(payment?.status || 'Paid')
  const [method, setMethod] = useState(payment?.paymentMethod || 'UPI')
  const [methodDetails, setMethodDetails] = useState(
    payment?.paymentMethodDetails || (payment?.paymentMethod === 'UPI' ? 'UPI / guest@okhdfcbank' : 'Visa ending in 4242')
  )
  const [notes, setNotes] = useState(payment?.notes || '')
  const [refundAmount, setRefundAmount] = useState(payment?.totalAmount || 0)
  const [refundReason, setRefundReason] = useState('Guest requested early departure / cancellation')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !payment) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (status === 'Refunded') {
        await issueRefund(payment.id, refundAmount, refundReason)
        toast.success(`Refund of ₹${Number(refundAmount).toLocaleString()} processed for ${payment.invoiceNumber}!`, {
          icon: '🔄',
        })
      } else {
        await updateStatus(payment.id, status, {
          paymentMethod: method,
          paymentMethodDetails: methodDetails,
          notes,
          receivedBy: 'Front Desk Cashier',
        })
        toast.success(`Payment status for ${payment.invoiceNumber} updated to ${status}!`, {
          icon: status === 'Paid' ? '✅' : '📝',
        })
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to update payment record.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/20 shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200">
                  Update Ledger
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">
                  {payment.invoiceNumber}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                Record Payment / Status
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            
            {/* Quick Bill Reference Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{payment.guestName}</p>
                <p className="text-[11px] text-slate-500">
                  Room #{payment.roomNumber} • {payment.nights} nights • {payment.bookingId}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Invoice Amount</span>
                <span className="text-base font-black text-[#1b4332] font-mono">
                  ₹{Number(payment.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Status <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'Paid', icon: CheckCircle2, label: 'Paid', activeColor: 'bg-emerald-50 border-emerald-500 text-emerald-800' },
                  { value: 'Pending', icon: Clock, label: 'Pending', activeColor: 'bg-amber-50 border-amber-500 text-amber-800' },
                  { value: 'Refunded', icon: RotateCcw, label: 'Refunded', activeColor: 'bg-purple-50 border-purple-500 text-purple-800' },
                  { value: 'Failed', icon: XCircle, label: 'Failed', activeColor: 'bg-rose-50 border-rose-500 text-rose-800' },
                ].map((s) => {
                  const Icon = s.icon
                  const isSelected = status === s.value
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatus(s.value)}
                      className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? `${s.activeColor} ring-2 ring-[#1b4332]/20 shadow-2xs`
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* If Refunded: Show Refund Fields */}
            {status === 'Refunded' ? (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Refund Specification (INR)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={payment.totalAmount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Math.min(payment.totalAmount, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-white font-mono font-bold text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <p className="text-[10px] text-purple-700 mt-1">
                    Max refundable: ₹{Number(payment.totalAmount).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Refund Reason
                  </label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="e.g. Flight cancelled, customer dispute, double charge"
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Payment Method Channel
                  </label>
                  <select
                    value={method}
                    onChange={(e) => {
                      setMethod(e.target.value)
                      if (e.target.value === 'UPI') setMethodDetails('UPI / guest@okhdfcbank')
                      else if (e.target.value === 'Cash') setMethodDetails('Cash received at front desk')
                      else if (e.target.value === 'Net Banking') setMethodDetails('Corporate Net Banking Transfer')
                      else setMethodDetails('Card ending in 4242')
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition cursor-pointer"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Method Details / Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Payment Instrument Details / Gateway Ref
                  </label>
                  <input
                    type="text"
                    value={methodDetails}
                    onChange={(e) => setMethodDetails(e.target.value)}
                    placeholder="e.g. UPI ID, Card ending digits, UTR number"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Internal Audit Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Advance paid; balance cleared via POS terminal at desk..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Action Buttons Fixed Footer */}
          <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Save Payment Record</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
