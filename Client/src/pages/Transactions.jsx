import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'
import { toast } from "react-toastify"

const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const toInputDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
}

const Transactions = () => {
    const { isDark } = useTheme()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        description: '',
        date: '',
        type: 'Expense',
        amount: '',
        categoryId: '',
    })
    const API = import.meta.env.VITE_BACKEND_URL

    const loadTransactions = useCallback(async () => {
        axios.defaults.withCredentials = true
        try {
            const res = await axios.get(`${API}/transactions`)
            if (res.data.success) {
                setTransactions(res.data.transactions)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }, [API])

    const loadCategories = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/categories`)
            if (res.data.success) {
                setCategories(res.data.categories)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }, [API])

    useEffect(() => {
        loadTransactions()
        loadCategories()
    }, [loadTransactions, loadCategories])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const openAddModal = () => {
        setEditingId(null)
        setFormData({ description: '', date: '', type: 'Expense', amount: '', categoryId: '' })
        setShowModal(true)
    }

    const openEditModal = (tx) => {
        setEditingId(tx.id)
        setFormData({
            description: tx.desc,
            date: toInputDate(tx.date),
            type: tx.type,
            amount: tx.amount.toString(),
            categoryId: tx.category ? tx.category.id : '',
        })
        setShowModal(true)
    }

    const handleDelete = async (tx) => {
        if (!window.confirm(`Delete "${tx.desc}"?`)) return
        try {
            const res = await axios.delete(`${API}/transactions/${tx.id}`)
            if (res.data.success) {
                toast.success('Transaction deleted')
                loadTransactions()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            date: formData.date,
            desc: formData.description,
            type: formData.type,
            amount: Number(formData.amount),
            categoryId: formData.categoryId || null,
        }
        try {
            if (editingId) {
                const res = await axios.put(`${API}/transactions/${editingId}`, payload)
                if (res.data.success) {
                    toast.success('Transaction updated')
                } else {
                    toast.error(res.data.message)
                    return
                }
            } else {
                const res = await axios.post(`${API}/transactions`, payload)
                if (res.data.success) {
                    toast.success('Transaction added')
                } else {
                    toast.error(res.data.message)
                    return
                }
            }
            setShowModal(false)
            loadTransactions()
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const inputBase = `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 border ${isDark
        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
        }`

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Transactions
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage your income and expenses
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Transaction
                </button>
            </div>

            <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-white border-slate-200'
                }`}>
                <div className="p-6 pt-4 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className={`text-sm py-16 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            No transactions yet. Click "Add Transaction" to get started.
                        </p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                    <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date</th>
                                    <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description</th>
                                    <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                                    <th className={`text-left text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</th>
                                    <th className={`text-right text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                                    <th className={`text-center text-xs font-semibold uppercase tracking-wider pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className={`border-b transition-all duration-300 ${isDark ? 'border-slate-700/30 hover:bg-slate-700/20' : 'border-slate-50 hover:bg-slate-50'
                                            }`}
                                    >
                                        <td className={`py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{formatDate(tx.date)}</td>
                                        <td className={`py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{tx.desc}</td>
                                        <td className="py-4">
                                            {tx.category ? (
                                                <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${tx.category.color}20`, color: tx.category.color }}>
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.category.color }} />
                                                    {tx.category.name}
                                                </span>
                                            ) : (
                                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tx.type === 'Income'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`py-4 text-sm font-semibold text-right ${tx.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'
                                            }`}>
                                            {tx.type === 'Income' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(tx)}
                                                    className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${isDark
                                                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                                                        : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tx)}
                                                    className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${isDark
                                                        ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                                                        : 'text-rose-500 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowModal(false)}
                    />
                    <div className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-slide-up ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'
                        }`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {editingId ? 'Edit Transaction' : 'Add Transaction'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Grocery shopping"
                                    required
                                    className={inputBase}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className={inputBase}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={inputBase}
                                    >
                                        <option value="Expense">Expense</option>
                                        <option value="Income">Income</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Category
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className={inputBase}
                                    >
                                        <option value="">None</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                    className={inputBase}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                >
                                    {editingId ? 'Update Transaction' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transactions
