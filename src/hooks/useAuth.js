
import { useContext } from 'react'
import { AuthContext } from '../context/auth-context.js'

// Custom hook to access authentication data.
export function useAuth() {
  const context = useContext(AuthContext)

  // Prevent using this hook outside AuthProvider.
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }

  return context
}
