import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'dark' : true
    })

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = () => useContext(ThemeContext)

export { useTheme }
