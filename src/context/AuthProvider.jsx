
import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'

import { auth } from '../firebase.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  // Stores the currently signed-in Firebase user.
  const [user, setUser] = useState(null)

  // Wait until Firebase checks the user's authentication status.
  const [loading, setLoading] = useState(true)

  // Listen for login and logout changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    // Stop listening when the provider unmounts.
    return unsubscribe
  }, [])

  // Register a new account with a display name.
  async function register(name, email, password) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Save the user's display name in Firebase.
    await updateProfile(credential.user, {
      displayName: name,
    })

    setUser({ ...credential.user, displayName: name })
  }

  // Log in using email and password.
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Log in using a Google account.
  function loginWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider())
  }

  // Log out the current user.
  function logout() {
    return signOut(auth)
  }

  // Make authentication data available to the application.
  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
