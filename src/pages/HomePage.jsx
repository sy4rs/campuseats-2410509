
import { Link } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useAuth } from '../hooks/useAuth.js'
import VendorCard from '../components/VendorCard.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

// Displays all vendors and the signed-in user's recently viewed vendors.
function HomePage() {
  const { vendors, loading, error, reload } = useVendors()

  // Get the currently signed-in Firebase user.
  const { user } = useAuth()

  // Each user receives a separate Recently Viewed storage key.
  const recentKey = `ce-recent-${user?.uid ?? 'guest'}`

  // Guests can see an empty list, but their activity is not saved.
  const [recentlyViewed] = useLocalStorage(
    recentKey,
    [],
    Boolean(user)
  )

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section>
      {/* WEEK 5 PERSONAL FEATURE: RECENTLY VIEWED PER USER */}
      {recentlyViewed.length > 0 && (
        <section>
          <h2 className="section-title">Recently viewed</h2>

          <ul className="recent-list">
            {recentlyViewed.map((vendor) => (
              <li key={vendor.id}>
                <Link to={`/vendor/${vendor.id}`}>
                  {vendor.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className="section-title">Choose a vendor</h2>

      <div className="vendor-grid">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </section>
  )
}

export default HomePage
