
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { Loading } from './Status.jsx'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait until Firebase finishes checking the authentication status.
  if (loading) {
    return <Loading />
  }

  // If the user is not signed in, redirect to login.
  // Remember the page they originally wanted to access.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // If signed in, display the protected page.
  return <Outlet />
}

export default ProtectedRoute
