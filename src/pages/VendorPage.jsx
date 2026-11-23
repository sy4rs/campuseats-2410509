
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useAuth } from '../hooks/useAuth.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

function VendorPage() {
  // Get the vendor ID from the URL.
  const { id } = useParams()

  // Get vendor data and loading/error states.
  const { vendors, loading, error, reload } = useVendors()

  // Get the currently signed-in user.
  const { user } = useAuth()

  // Create a separate Recently Viewed key for each user.
  const recentKey = `ce-recent-${user?.uid ?? 'guest'}`

  // Save Recently Viewed only for signed-in users.
  const [, setRecentlyViewed] = useLocalStorage(
    recentKey,
    [],
    Boolean(user)
  )

  // Find the selected vendor.
  const vendor = vendors.find(
    (v) => String(v.id) === String(id)
  )

  // Update Recently Viewed when a vendor is opened.
  useEffect(() => {
    if (vendor && user) {
      setRecentlyViewed((previous) => {
        // Remove duplicate entries.
        const withoutCurrentVendor = previous.filter(
          (recent) => recent.id !== vendor.id
        )

        // Add current vendor first and keep maximum five.
        return [
          { id: vendor.id, name: vendor.name },
          ...withoutCurrentVendor,
        ].slice(0, 5)
      })
    }
  }, [vendor, user, setRecentlyViewed])

  // Display loading state.
  if (loading) {
    return <Loading />
  }

  // Display error state.
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={reload}
      />
    )
  }

  // Handle invalid vendor ID.
  if (!vendor) {
    return (
      <section>
        <h2 className="section-title">
          Vendor not found
        </h2>

        <p className="muted">
          There is no vendor called "{id}".{' '}
          <Link to="/">Back to vendors</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      {/* Temporary navigation test */}
      <p>
        <button
          type="button"
          onClick={() => window.location.assign('/')}
        >
          ← All vendors
        </button>
      </p>

      <h2 className="section-title">
        {vendor.name}
      </h2>

      <p className="muted">
        {vendor.location} · {vendor.openHours}
      </p>

      {/* Display the vendor's menu items. */}
      <MenuList items={vendor.menu} />
    </section>
  )
}

export default VendorPage
