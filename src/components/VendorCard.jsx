import { Link } from 'react-router'

function VendorCard({ vendor }) {
  const initial = vendor.name.charAt(0)

  return (
    <Link to={`/vendor/${vendor.id}`} className="card vendor-card">
      <div className="thumb">{initial}</div>
      <div className="info">
        <h3>{vendor.name}</h3>
        <p>{vendor.location}</p>
        <span className={vendor.isOpen ? "status open" : "status closed"}>
          {vendor.isOpen ? "Open now" : "Closed"}
        </span>
      </div>
    </Link>
  )
}

export default VendorCard