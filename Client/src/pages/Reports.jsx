import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'

const fmt = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

const now = () => new Date()

const PRESETS = [
    { label: 'This Month', from: () => fmt(new Date(now().getFullYear(), now().getMonth(), 1)), to: () => fmt(now()) },
    { label: 'Last Month', from: () => fmt(new Date(now().getFullYear(), now().getMonth() - 1, 1)), to: () => fmt(new Date(now().getFullYear(), now().getMonth(), 0)) },
    { label: 'Last 6 Months', from: () => fmt(new Date(now().getFullYear(), now().getMonth() - 5, 1)), to: () => fmt(now()) },
    { label: 'This Year', from: () => fmt(new Date(now().getFullYear(), 0, 1)), to: () => fmt(now()) },
    { label: 'All Time', from: () => '', to: () => '' },
]

const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function CustomTooltip({ active, payload, label, isDark }) {
    if (active && payload && payload.length) {
        return (
            <div className={`px-4 py-3 rounded-xl shadow-xl border backdrop-blur-sm ${isDark ? 'bg-slate-800/90 border-slate-600/50 text-white' : 'bg-white/90 border-slate-200 text-slate-800'}`}>
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: ${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-semibold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const Reports = () => {
    const { isDark } = useTheme()
    const API = import.meta.env.VITE_BACKEND_URL
    const [activePreset, setActivePreset] = useState('This Month')
    const [custom, setCustom] = useState({ from: '', to: '' })
    const [report, setReport] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [loading, setLoading] = useState(true)

    const buildParams = useCallback(() => {
        const preset = PRESETS.find((p) => p.label === activePreset)
        const from = custom.from || preset.from()
        const to = custom.to || preset.to()
        const params = new URLSearchParams()
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        return params.toString()
    }, [activePreset, custom])

    const loadReport = useCallback(async () => {
        axios.defaults.withCredentials = true
        setLoading(true)
        try {
            const res = await axios.get(`${API}/reports/summary?${buildParams()}`)
            if (res.data.success) {
                setReport(res.data.report)
                setTransactions(res.data.transactions || [])
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }, [API, buildParams])

    useEffect(() => {
        loadReport()
    }, [loadReport])

    const applyPreset = (label) => {
        setCustom({ from: '', to: '' })
        setActivePreset(label)
    }

    const cards = [
        { label: 'Income', value: report?.totalIncome ?? 0, color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20' },
        { label: 'Expenses', value: report?.totalExpenses ?? 0, color: 'from-rose-500 to-pink-400', shadow: 'shadow-rose-500/20' },
        { label: 'Balance', value: report?.balance ?? 0, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
        { label: 'Transactions', value: report?.count ?? 0, color: 'from-violet-500 to-purple-400', shadow: 'shadow-violet-500/20' },
    ]

    const visible = showAll ? transactions : transactions.slice(0, 10)

    return (
        <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Reports
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Analyze your income and spending
                    </p>
                </div>
                <div className={`flex items-center gap-2 p-1.5 rounded-xl border backdrop-blur-xl ${isDark ? 'bg-slate-800/60 border-slate-700/40' : 'bg-white border-slate-200'}`}>
                    {PRESETS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => applyPreset(p.label)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${activePreset === p.label && !custom.from && !custom.to
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2">
                    <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From</label>
                    <input
                        type="date"
                        value={custom.from}
                        onChange={(e) => setCustom({ ...custom, from: e.target.value })}
                        className={`px-3 py-2 rounded-xl text-sm outline-none border transition-all ${isDark ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To</label>
                    <input
                        type="date"
                        value={custom.to}
                        onChange={(e) => setCustom({ ...custom, to: e.target.value })}
                        className={`px-3 py-2 rounded-xl text-sm outline-none border transition-all ${isDark ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    />
                </div>
                {(custom.from || custom.to) && (
                    <button
                        onClick={() => { setCustom({ from: '', to: '' }); setActivePreset('This Month') }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-500 hover:bg-rose-50'}`}
                    >
                        Reset
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((card) => (
                            <div key={card.label} className={`relative rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700/50 shadow-xl' : 'bg-white border-slate-200 shadow-md'}`}>
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</p>
                                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {card.label === 'Transactions'
                                        ? Number(card.value).toLocaleString()
                                        : `$${Number(card.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                </p>
                                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${card.color} ${card.shadow}`} />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className={`lg:col-span-2 rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                            <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Monthly Income vs Expenses
                            </h2>
                            {report?.monthly?.length ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={report.monthly} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                        <XAxis dataKey="label" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }} />
                                        <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }} />
                                        <Tooltip content={<CustomTooltip isDark={isDark} />} />
                                        <Legend wrapperStyle={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                                        <Bar dataKey="Income" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="Expense" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className={`text-sm py-16 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No data for the selected period.</p>
                            )}
                        </div>

                        <div className={`rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                            <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Expenses by Category
                            </h2>
                            {report?.byCategory?.length ? (
                                <>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={report.byCategory}
                                                cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                                                paddingAngle={4} dataKey="value" nameKey="name"
                                                labelLine={false} label={PieLabel}
                                            >
                                                {report.byCategory.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-2 mt-4">
                                        {report.byCategory.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</span>
                                                </div>
                                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                    ${Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className={`text-sm py-16 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No expenses in the selected period.</p>
                            )}
                        </div>
                    </div>

                    <div className={`rounded-2xl border backdrop-blur-sm transition-colors duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between p-6 pb-0">
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Transactions
                            </h2>
                            {transactions.length > 10 && (
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${isDark ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-600 hover:bg-blue-50'}`}
                                >
                                    {showAll ? 'Show Less' : `View All (${transactions.length})`}
                                </button>
                            )}
                        </div>
                        <div className="p-6 pt-4 overflow-x-auto">
                            {visible.length ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                            <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date</th>
                                            <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description</th>
                                            <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                                            <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</th>
                                            <th className={`text-right text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visible.map((tx) => (
                                            <tr key={tx.id} className={`border-b transition-all duration-300 ${isDark ? 'border-slate-700/30 hover:bg-slate-700/20' : 'border-slate-50 hover:bg-slate-50'}`}>
                                                <td className={`py-3.5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{formatDate(tx.date)}</td>
                                                <td className={`py-3.5 text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{tx.desc}</td>
                                                <td className="py-3.5">
                                                    {tx.category ? (
                                                        <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${tx.category.color}20`, color: tx.category.color }}>
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.category.color }} />
                                                            {tx.category.name}
                                                        </span>
                                                    ) : (
                                                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className={`py-3.5 text-sm font-semibold text-right ${tx.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {tx.type === 'Income' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className={`text-sm py-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    No transactions in the selected period.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Reports
