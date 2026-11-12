import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

function VendorPage() {
  // Read dynamic :id parameter from URL path (/vendor/:id)
  const { id } = useParams()

  // Access fetched vendor data and state handlers
  const { vendors, loading, error, reload } = useVendors()

  // Persist recently viewed items in browser storage
  const [, setRecentlyViewed] = useLocalStorage('campuseats-recently-viewed', [])

  // Find active vendor matching the URL id
  const vendor = vendors.find((v) => String(v.id) === String(id))

  // Update recently viewed list when vendor is loaded (newest first, max 5, deduplicated)
  useEffect(() => {
    if (vendor) {
      setRecentlyViewed((previous) => {
        const withoutCurrentVendor = previous.filter(
          (recent) => recent.id !== vendor.id
        )
        return [
          { id: vendor.id, name: vendor.name },
          ...withoutCurrentVendor
        ].slice(0, 5)
      })
    }
  }, [vendor, setRecentlyViewed])

  // Handle loading and error fetch states
  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  // Handle invalid vendor ID fallback
  if (!vendor) {
    return (
      <section>
        <h2 className="section-title">Vendor not found</h2>
        <p className="muted">
          There is no vendor called "{id}". <Link to="/">Back to vendors</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <p><Link to="/">← All vendors</Link></p>

      <h2 className="section-title">{vendor.name}</h2>
      <p className="muted">{vendor.location} · {vendor.openHours}</p>

      {/* Render menu items using MenuList component */}
      <MenuList items={vendor.menu} />
    </section>
  )
}

export default VendorPage