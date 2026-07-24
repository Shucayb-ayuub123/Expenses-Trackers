import { useTheme } from '../context/ThemeContext'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'

const monthlyData = [
    { month: 'Jan', Income: 1000, Expense: 700 },
    { month: 'Feb', Income: 1200, Expense: 900 },
    { month: 'Mar', Income: 1500, Expense: 800 },
    { month: 'Apr', Income: 1300, Expense: 950 },
    { month: 'May', Income: 1600, Expense: 1100 },
    { month: 'Jun', Income: 1400, Expense: 1000 },
    { month: 'Jul', Income: 1000, Expense: 550 },
]

const transactions = [
    { date: 'Jul 24', desc: 'Salary', type: 'Income', amount: 1000 },
    { date: 'Jul 23', desc: 'Food', type: 'Expense', amount: 20 },
    { date: 'Jul 22', desc: 'Transport', type: 'Expense', amount: 15 },
    { date: 'Jul 21', desc: 'Shopping', type: 'Expense', amount: 80 },
    { date: 'Jul 20', desc: 'Freelance', type: 'Income', amount: 500 },
    { date: 'Jul 19', desc: 'Bills', type: 'Expense', amount: 120 },
    { date: 'Jul 18', desc: 'Food', type: 'Expense', amount: 35 },
    { date: 'Jul 17', desc: 'Entertainment', type: 'Expense', amount: 45 },
    { date: 'Jul 16', desc: 'Investment', type: 'Income', amount: 200 },
    { date: 'Jul 15', desc: 'Utilities', type: 'Expense', amount: 90 },
]

const categoryData = [
    { name: 'Food', value: 35, color: '#3b82f6' },
    { name: 'Transport', value: 20, color: '#06b6d4' },
    { name: 'Shopping', value: 15, color: '#8b5cf6' },
    { name: 'Bills', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#10b981' },
]

const totalIncome = 8000
const totalExpenses = 2800
const totalBalance = totalIncome - totalExpenses

const cards = [
    {
        label: 'Total Balance',
        value: `$${totalBalance.toLocaleString()}`,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'from-blue-500 to-cyan-400',
        shadow: 'shadow-blue-500/20',
    },
    {
        label: 'Total Income',
        value: `$${totalIncome.toLocaleString()}`,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'from-emerald-500 to-teal-400',
        shadow: 'shadow-emerald-500/20',
    },
    {
        label: 'Total Expenses',
        value: `$${totalExpenses.toLocaleString()}`,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
        color: 'from-rose-500 to-pink-400',
        shadow: 'shadow-rose-500/20',
    },
    {
        label: 'Savings',
        value: `$${totalBalance.toLocaleString()}`,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        color: 'from-violet-500 to-purple-400',
        shadow: 'shadow-violet-500/20',
    },
]

function CustomTooltip({ active, payload, label, isDark }) {
    if (active && payload && payload.length) {
        return (
            <div className={`px-4 py-3 rounded-xl shadow-xl border backdrop-blur-sm ${
                isDark ? 'bg-slate-800/90 border-slate-600/50 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
            }`}>
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: ${entry.value.toLocaleString()}
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

const Dashboard = () => {
    const { isDark } = useTheme()

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Dashboard
                </h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Welcome back! Here's your financial overview.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className={`relative rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                            isDark
                                ? 'bg-slate-800/80 border-slate-700/50 shadow-xl'
                                : 'bg-white border-slate-200 shadow-md'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {card.label}
                                </p>
                                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {card.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg ${card.shadow}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${card.color}`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
                }`}>
                    <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Monthly Income vs Expenses
                    </h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={monthlyData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                            />
                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                            <Legend
                                wrapperStyle={{ color: isDark ? '#94a3b8' : '#64748b' }}
                            />
                            <Bar dataKey="Income" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Expense" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
                }`}>
                    <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Expense Categories
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                labelLine={false}
                                label={PieLabel}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                        {categoryData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {item.name}
                                    </span>
                                </div>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl border backdrop-blur-sm transition-colors duration-300 ${
                isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
            }`}>
                <div className="flex items-center justify-between p-6 pb-0">
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Recent Transactions
                    </h2>
                    <button className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                        isDark
                            ? 'text-blue-400 hover:bg-blue-500/10'
                            : 'text-blue-600 hover:bg-blue-50'
                    }`}>
                        View All
                    </button>
                </div>
                <div className="p-6 pt-4 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date</th>
                                <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description</th>
                                <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</th>
                                <th className={`text-right text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr
                                    key={index}
                                    className={`border-b transition-colors ${
                                        isDark ? 'border-slate-700/30 hover:bg-slate-700/20' : 'border-slate-50 hover:bg-slate-50'
                                    }`}
                                >
                                    <td className={`py-3.5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{tx.date}</td>
                                    <td className={`py-3.5 text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{tx.desc}</td>
                                    <td className="py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            tx.type === 'Income'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-rose-500/10 text-rose-500'
                                        }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={`py-3.5 text-sm font-semibold text-right ${
                                        tx.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'
                                    }`}>
                                        {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
