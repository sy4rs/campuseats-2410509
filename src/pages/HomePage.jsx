import { Link } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import VendorCard from '../components/VendorCard.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

// COMPONENT: HomePage
// Purpose: Displays all vendors and the user's recently viewed vendors.
function HomePage() {
  // Get vendor data, loading status, error message and retry function.
  const { vendors, loading, error, reload } = useVendors()

  // Read the recently viewed list saved by VendorPage.
  // It is shared through localStorage, so it survives a page refresh.
  const [recentlyViewed] = useLocalStorage('campuseats-recently-viewed', [])

  // Show loading or error UI before trying to display the vendor list.
  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section>
      {/* WEEK 4 PERSONAL FEATURE (MATRIC DIGIT 9): RECENTLY VIEWED */}
      {/* Only display this section when the user has viewed at least one vendor. */}
      {recentlyViewed.length > 0 && (
        <section>
          <h2 className="section-title">Recently viewed</h2>

          {/* map() creates one clickable link for each saved vendor. */}
          <ul className="recent-list">
            {recentlyViewed.map((vendor) => (
              <li key={vendor.id}>
                {/* Link navigates to the vendor page without reloading the app. */}
                <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Display every vendor returned by the API. */}
      <h2 className="section-title">Choose a vendor</h2>
      <div className="vendor-grid">
        {vendors.map((vendor) => (
          // key gives each rendered VendorCard a unique identifier.
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </section>
  )
}

export default HomePage
