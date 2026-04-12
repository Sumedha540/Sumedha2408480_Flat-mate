/**
 * THEME CONTEXT - Global dark mode management
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

// Create context with null default to detect missing provider
const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  console.log('🎨 ThemeProvider: Rendering with theme:', theme);

  // Load theme from localStorage on mount
  useEffect(() => {
    console.log('🎨 ThemeProvider: Mounting, loading from localStorage');
    try {
      const saved = localStorage.getItem('fm_theme')
      console.log('🎨 ThemeProvider: Loaded from localStorage:', saved);
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved)
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }, [])

  // Apply theme changes to DOM
  useEffect(() => {
    try {
      console.log('🎨 ThemeContext: Applying theme:', theme);
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark')
        console.log('🎨 ThemeContext: Added dark class to root');
      } else {
        root.classList.remove('dark')
        console.log('🎨 ThemeContext: Removed dark class from root');
      }
      
      localStorage.setItem('fm_theme', theme)
      console.log('🎨 ThemeContext: Saved theme to localStorage:', theme);
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    console.log('🎨 REAL toggleTheme called from ThemeProvider, current theme:', theme);
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('🎨 ThemeContext: Switching from', prev, 'to', newTheme);
      return newTheme;
    })
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  console.log('🎨 ThemeProvider: Providing value:', value);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider. Make sure ThemeProvider wraps your component tree.')
  }
  
  console.log('🎨 useTheme: Got context:', context);
  return context
}
