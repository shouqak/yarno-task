import React, { createContext, useContext, useMemo, useState, useEffect } from "react"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light")
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user")
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem("mode", mode)
  }, [mode])

  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"))

  const signOut = () => {
    try {
      localStorage.removeItem("user")
    } catch {}
    setCurrentUser(null)
  }

  const value = useMemo(
    () => ({ mode, toggleTheme, currentUser, setCurrentUser, signOut }),
    [mode, currentUser]
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
