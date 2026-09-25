import { useState } from 'react'
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'
import HotelookLogo from '../layout/HotelookLogo'
import { HOTEL_BILLING_INFO } from '../../services/paymentApi'

export default function InvoiceModal({ isOpen, onClose, payment }) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen || !payment) return null

  // Status configuration
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          stamp: 'border-emerald-600 text-emerald-700 bg-emerald-50/60',
          icon: CheckCircle2,
          label: 'PAID / SETTLED',
        }
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          stamp: 'border-amber-600 text-amber-700 bg-amber-50/60',
          icon: Clock,
          label: 'PAYMENT PENDING',
        }
      case 'Refunded':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          stamp: 'border-purple-600 text-purple-700 bg-purple-50/60',
          icon: RotateCcw,
          label: 'REFUND PROCESSED',
        }
      case 'Failed':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          stamp: 'border-rose-600 text-rose-700 bg-rose-50/60',
          icon: XCircle,
          label: 'TRANSACTION FAILED',
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-300',
          stamp: 'border-slate-500 text-slate-600 bg-slate-50/60',
          icon: CheckCircle2,
          label: 'INVOICED',
        }
    }
  }

  const statusConfig = getStatusBadge(payment.status)

  // Simulated Dummy Download Invoice
  const handleDownloadInvoice = () => {
    setIsDownloading(true)
    toast.info(`Preparing ${payment.invoiceNumber} for PDF generation...`, {
      icon: '⏳',
      autoClose: 1800,
    })

    setTimeout(() => {
      // Create a formatted text slip as dummy download payload
      const invoiceData = `
============================================================
              HOTELOOK LUXURY RESORTS & SUITES              
                OFFICIAL TAX INVOICE / RECEIPT              
============================================================
Invoice Number: ${payment.invoiceNumber}
Date of Issue:  ${new Date(payment.transactionDate || payment.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
Transaction ID: ${payment.id}
Booking Ref:    ${payment.bookingId}
GSTIN:          ${HOTEL_BILLING_INFO.gstin}
SAC Code:       ${HOTEL_BILLING_INFO.sacCode}

BILLED TO:
------------------------------------------------------------
Guest Name:     ${payment.guestName}
Email:          ${payment.guestEmail || 'N/A'}
Phone:          ${payment.guestPhone || 'N/A'}
Address:        ${payment.guestAddress || 'N/A'}
ID Proof:       ${payment.guestIdProof || 'Verified Govt ID'}

STAY SPECIFICATIONS:
------------------------------------------------------------
Room:           #${payment.roomNumber} - ${payment.roomType}
Check-In:       ${payment.checkIn}
Check-Out:      ${payment.checkOut}
Duration:       ${payment.nights} Night(s)
Tariff / Night: ₹${Number(payment.ratePerNight || 0).toLocaleString()}

ITEMIZED FINANCIAL BREAKDOWN:
------------------------------------------------------------
1. Base Room Tariff (${payment.nights} nights):     ₹${Number(payment.subtotal || 0).toLocaleString()}
${payment.extraCharges > 0 ? `2. Incidental / Extra Charges:          ₹${Number(payment.extraCharges).toLocaleString()} (${payment.extraChargesDetails || 'Services'})\n` : ''}3. CGST (Central Tax @ 6%):             ₹${Number(payment.cgst || payment.taxAmount / 2 || 0).toLocaleString()}
4. SGST (State Tax @ 6%):               ₹${Number(payment.sgst || payment.taxAmount / 2 || 0).toLocaleString()}
------------------------------------------------------------
GRAND TOTAL PAYABLE:                    ₹${Number(payment.totalAmount || 0).toLocaleString()}
AMOUNT SETTLED:                         ₹${Number(payment.amountPaid || 0).toLocaleString()}
PAYMENT STATUS:                         ${payment.status.toUpperCase()}
PAYMENT METHOD:                         ${payment.paymentMethod} (${payment.paymentMethodDetails || 'Direct'})
------------------------------------------------------------
Authorized Hotelook Digital Seal & Audit Clearance
Thank you for choosing Hotelook. We look forward to your next visit!
============================================================
`

      const blob = new Blob([invoiceData.trim()], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Hotelook_${payment.invoiceNumber}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsDownloading(false)
      toast.success(`Invoice ${payment.invoiceNumber} downloaded successfully!`, {
        icon: '📥',
      })
    }, 1200)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:max-h-none">
        
        {/* Header Action Bar */}
        <div className="flex-shrink-0 bg-[#1b4332] text-white p-5 sm:p-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <HotelookLogo size="md" variant="light" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200">
                  Tax Invoice
                </span>
                <span className="text-xs text-emerald-200/80 font-mono font-bold">
                  {payment.invoiceNumber}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Official Hotel Folio & Receipt
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer disabled:opacity-50"
              title="Download Dummy PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white transition cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-6 bg-white text-slate-800 font-sans">
          
          {/* Top Invoice Header & Watermark */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <HotelookLogo size="lg" />
              <p className="text-xs text-slate-500 font-medium mt-2">
                {HOTEL_BILLING_INFO.legalEntity}
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mt-0.5 leading-relaxed">
                {HOTEL_BILLING_INFO.address}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                <span>GSTIN: <strong>{HOTEL_BILLING_INFO.gstin}</strong></span>
                <span>•</span>
                <span>SAC Code: <strong>{HOTEL_BILLING_INFO.sacCode}</strong></span>
              </div>
            </div>

            {/* Invoice Meta & Status Stamp */}
            <div className="flex flex-col sm:items-end">
              <div
                className={`inline-block px-4 py-1.5 rounded-xl border-2 font-black text-xs uppercase tracking-widest text-center shadow-xs rotate-[-2deg] ${statusConfig.stamp}`}
              >
                {statusConfig.label}
              </div>

              <div className="mt-4 sm:text-right space-y-1 text-xs">
                <p className="text-slate-400 font-medium">Invoice Number</p>
                <p className="font-mono font-black text-base text-slate-900">{payment.invoiceNumber}</p>
                <p className="text-slate-400 font-medium pt-1">Date of Issue</p>
                <p className="font-semibold text-slate-800">
                  {new Date(payment.transactionDate || payment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-slate-400 font-medium pt-1">Booking Reference</p>
                <p className="font-mono font-bold text-emerald-800">{payment.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Billed To / Guest Details & Stay Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Dossier */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Billed To (Guest)
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ID Verified</span>
                </span>
              </div>
              <p className="font-black text-slate-900 text-sm">{payment.guestName}</p>
              <p className="text-xs text-slate-600">{payment.guestEmail || 'No email provided'}</p>
              <p className="text-xs text-slate-600">{payment.guestPhone || 'No phone provided'}</p>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/60 truncate">
                Address: {payment.guestAddress || 'Registered Guest'}
              </p>
            </div>

            {/* Room & Stay Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Stay Specifications
              </span>
              <div className="flex items-baseline justify-between">
                <p className="font-black text-slate-900 text-sm">
                  Room #{payment.roomNumber}
                </p>
                <span className="text-xs font-bold text-slate-600">
                  {payment.nights} {payment.nights === 1 ? 'Night' : 'Nights'}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate">{payment.roomType}</p>
              <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Check-In: <strong>{payment.checkIn}</strong></span>
                <span>Check-Out: <strong>{payment.checkOut}</strong></span>
              </div>
              <p className="text-[11px] text-[#1b4332] font-semibold">
                Rate: ₹{Number(payment.ratePerNight || 0).toLocaleString()} / night
              </p>
            </div>
          </div>

          {/* Itemized Tax Invoice Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b4332]/5 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">SAC Code</th>
                  <th className="px-4 py-3 text-center">Qty / Nights</th>
                  <th className="px-4 py-3 text-right">Unit Rate (₹)</th>
                  <th className="px-4 py-3 text-right">Taxable Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {/* Line 1: Room Charges */}
                <tr>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">Room Accommodation Tariff</p>
                    <p className="text-[11px] text-slate-400">{payment.roomType} (Room #{payment.roomNumber})</p>
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-slate-500">996311</td>
                  <td className="px-4 py-3.5 text-center font-bold">{payment.nights}</td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    ₹{Number(payment.ratePerNight || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono">
                    ₹{Number(payment.subtotal || 0).toLocaleString()}
                  </td>
                </tr>

                {/* Line 2: Extra Charges if any */}
                {payment.extraCharges > 0 && (
                  <tr>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">Incidentals & Add-on Services</p>
                      <p className="text-[11px] text-slate-400">{payment.extraChargesDetails || 'Minibar / Laundry'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500">996331</td>
                    <td className="px-4 py-3.5 text-center font-bold">1</td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      ₹{Number(payment.extraCharges).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono">
                      ₹{Number(payment.extraCharges).toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Calculations Summary Breakdown */}
            <div className="bg-slate-50/80 p-4 sm:p-5 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal (Taxable Value):</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{(Number(payment.subtotal || 0) + Number(payment.extraCharges || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span>Central GST (CGST @ 6%):</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{Number(payment.cgst || payment.taxAmount / 2 || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span>State GST (SGST @ 6%):</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{Number(payment.sgst || payment.taxAmount / 2 || 0).toLocaleString()}
                </span>
              </div>

              {payment.refundedAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-purple-700 font-semibold pt-1 border-t border-slate-200">
                  <span>Refunded Amount:</span>
                  <span className="font-mono font-bold">
                    - ₹{Number(payment.refundedAmount).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Final Invoice</span>
                  <span className="text-[10px] text-slate-500 font-medium">Inclusive of 12% Luxury Hotel GST</span>
                </div>
                <span className="text-2xl font-black text-[#1b4332] font-mono">
                  ₹{Number(payment.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method & Audit Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Channel
              </span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1b4332]" />
                <span className="font-bold text-slate-800">{payment.paymentMethod}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                {payment.paymentMethodDetails || 'Direct Settlement'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Ref: {payment.paymentGatewayRef || payment.id}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Verification & Clearance
              </span>
              <p className="font-bold text-slate-800">{payment.receivedBy || 'Front Desk Operations'}</p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audited Tax Invoice (Form GST INV-1)</span>
              </p>
            </div>
          </div>

          {/* Footer Terms & Digital Barcode */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-semibold text-slate-600">
                Terms: This is a computer generated legal tax invoice under the GST Act.
              </p>
              <p className="text-[10px] text-slate-400">
                For questions regarding this folio, reach out to {HOTEL_BILLING_INFO.email}
              </p>
            </div>

            {/* Visual Simulated Barcode */}
            <div className="flex flex-col items-center sm:items-end">
              <div className="flex items-center gap-0.5 h-6">
                {[4, 2, 6, 3, 5, 2, 7, 3, 2, 5, 4, 6, 2, 3, 5, 2, 4, 3, 6, 2].map((height, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-slate-800"
                    style={{ height: `${height * 3}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">{payment.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Sticky Footer */}
        <div className="flex-shrink-0 p-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-3xl print:hidden">
          <p className="text-xs text-slate-500 hidden sm:block">
            Hotelook Management System • Invoicing & Payments Ledger
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1b4332] hover:bg-[#133225] shadow-md hover:shadow-lg transition cursor-pointer"
            >
              Close Folio
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
