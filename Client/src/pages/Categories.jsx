import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'

const PALETTE = [
    '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b',
]

const Categories = () => {
    const { isDark } = useTheme()
    const API = import.meta.env.VITE_BACKEND_URL
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', color: PALETTE[0] })

    const loadCategories = useCallback(async () => {
        axios.defaults.withCredentials = true
        try {
            const res = await axios.get(`${API}/categories`)
            if (res.data.success) {
                setCategories(res.data.categories)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }, [API])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    const openAdd = () => {
        setEditing(null)
        setForm({ name: '', color: PALETTE[0] })
        setShowModal(true)
    }

    const openEdit = (cat) => {
        setEditing(cat)
        setForm({ name: cat.name, color: cat.color })
        setShowModal(true)
    }

    const handleDelete = async (cat) => {
        if (!window.confirm(`Delete category "${cat.name}"? Transactions will keep their amount but lose this category.`)) return
        try {
            const res = await axios.delete(`${API}/categories/${cat.id}`)
            if (res.data.success) {
                toast.success('Category deleted')
                loadCategories()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name.trim()) {
            toast.error('Category name is required')
            return
        }
        try {
            if (editing) {
                const res = await axios.put(`${API}/categories/${editing.id}`, {
                    name: form.name.trim(),
                    color: form.color,
                })
                if (res.data.success) {
                    toast.success('Category updated')
                } else {
                    toast.error(res.data.message)
                    return
                }
            } else {
                const res = await axios.post(`${API}/categories`, {
                    name: form.name.trim(),
                    color: form.color,
                })
                if (res.data.success) {
                    toast.success('Category created')
                } else {
                    toast.error(res.data.message)
                    return
                }
            }
            setShowModal(false)
            loadCategories()
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const inputBase = `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 border ${isDark
        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
        }`

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Categories
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Organize your transactions into labeled groups
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Category
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : categories.length === 0 ? (
                <div className={`rounded-2xl border backdrop-blur-xl p-12 text-center transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No categories yet. Create your first category to start organizing your expenses.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`group rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-white border-slate-200 shadow-sm'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${cat.color}20` }}
                                    >
                                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {cat.name}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {cat.transactionCount} transaction{cat.transactionCount === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEdit(cat)}
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
                                        onClick={() => handleDelete(cat)}
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
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: cat.color }} />
                        </div>
                    ))}
                </div>
            )}

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
                                {editing ? 'Edit Category' : 'Add Category'}
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Food, Transport, Bills"
                                    autoFocus
                                    className={inputBase}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {PALETTE.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setForm({ ...form, color })}
                                            className={`w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer ${form.color === color
                                                    ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                                                    : 'hover:scale-110'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                    <label
                                        className={`relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-2 border-dashed ${isDark ? 'border-slate-600' : 'border-slate-300'}`}
                                    >
                                        <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>+</span>
                                        <input
                                            type="color"
                                            value={form.color}
                                            onChange={(e) => setForm({ ...form, color: e.target.value })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </label>
                                </div>
                                <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Selected: <span className="font-mono" style={{ color: form.color }}>{form.color}</span>
                                </p>
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
                                    {editing ? 'Update Category' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
