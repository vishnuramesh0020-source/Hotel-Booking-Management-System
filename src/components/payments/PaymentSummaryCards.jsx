import {
  TrendingUp,
  Clock,
  RotateCcw,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  Banknote,
} from 'lucide-react'

export default function PaymentSummaryCards({ stats }) {
  if (!stats) return null

  const averageTransaction = stats.paidCount > 0
    ? Math.round(stats.totalCollected / stats.paidCount)
    : 0

  return (
    <div className="space-y-4">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Revenue Collected */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue Collected
            </span>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ₹{stats.totalCollected.toLocaleString()}
            </p>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.paidCount} settled transactions</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Pending Invoices */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Collections
            </span>
            <p className="text-2xl font-black text-amber-700 font-mono tracking-tight">
              ₹{stats.totalPending.toLocaleString()}
            </p>
            <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.pendingCount} unpaid folios</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Total Refunds */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Refunded
            </span>
            <p className="text-2xl font-black text-purple-700 font-mono tracking-tight">
              ₹{stats.totalRefunded.toLocaleString()}
            </p>
            <p className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{stats.refundedCount} refund claims</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center shrink-0 border border-purple-500/20">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Success Rate & Avg Ticket */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settlement Rate
            </span>
            <p className="text-2xl font-black text-[#1b4332] font-mono tracking-tight">
              {stats.successRate}%
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              Avg Ticket: <strong className="font-mono text-slate-800">₹{averageTransaction.toLocaleString()}</strong>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0 border border-[#1b4332]/20">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payment Method Distribution Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Channel Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of transactions and collections across payment methods
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {stats.totalTransactions} Total Transactions Recorded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'UPI', count: stats.methodCounts.UPI, amount: stats.methodAmounts.UPI, icon: QrCode, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
            { name: 'Credit Cards', count: stats.methodCounts['Credit Card'], amount: stats.methodAmounts['Credit Card'], icon: CreditCard, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { name: 'Net Banking', count: stats.methodCounts['Net Banking'], amount: stats.methodAmounts['Net Banking'], icon: Building, color: 'text-sky-700 bg-sky-50 border-sky-200' },
            { name: 'Cash', count: stats.methodCounts.Cash, amount: stats.methodAmounts.Cash, icon: Banknote, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          ].map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.name}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{m.name}</p>
                  <p className="text-sm font-black text-slate-900 font-mono">
                    ₹{m.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">{m.count} txns</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
