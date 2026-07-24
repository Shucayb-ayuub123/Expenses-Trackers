import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'

const navItems = [
    {
        label: 'Dashboard',
        to: '/',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Transactions',
        to: '/Transactions',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
    },
    {
        label: 'Reports',
        to: '/Reports',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
    },
    {
        label: 'Categories',
        to: '/Categories',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
        ),
    },
]

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { isDark } = useTheme()

    const handleLogout = async () => {
        const API = import.meta.env.VITE_BACKEND_URL
        axios.defaults.withCredentials = true
        try {
            const respon = await axios.post(`${API}/api/Auth/Logout`, { withCredentials: true })
            if (respon.data.success) {
                navigate('/Login')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            onClose()
        }
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col backdrop-blur-xl border-r p-5 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isDark ? 'bg-slate-800 border-slate-700/40' : 'bg-white border-slate-200'}`}>
                <div className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
                    isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'
                }`} />
                <div className={`absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
                    isDark ? 'bg-cyan-500/5' : 'bg-cyan-300/10'
                }`} />

                <div className="relative z-10 flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-110">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className={`text-lg font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-800'
                        }`}>
                            Expense<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tracker</span>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className={`lg:hidden p-1 rounded-lg transition-colors ${
                            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="relative z-10 flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${isActive
                                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                                    : isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
                                    }`}
                            >
                                <span className={`transition-colors duration-300 ${isActive ? 'text-blue-400' : isDark ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="relative z-10 pt-4 border-t border-slate-700/40">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 group cursor-pointer ${
                            isDark
                                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20'
                                : 'text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                        }`}
                    >
                        <span className={`transition-colors duration-300 ${isDark ? 'text-slate-500 group-hover:text-red-400' : 'text-slate-400 group-hover:text-red-500'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </span>
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar
