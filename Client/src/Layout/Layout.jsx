import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useTheme } from '../context/ThemeContext'

const Layout = () => {
  const { isDark, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`w-full flex overflow-y-hidden h-screen ${isDark ? 'dark' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={`flex-1 flex flex-col h-full overflow-y-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        <header className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${
          isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-white/50 border-slate-200'
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isDark ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs transition-transform duration-300 ${
              isDark ? 'translate-x-7' : 'translate-x-0'
            }`}>
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
