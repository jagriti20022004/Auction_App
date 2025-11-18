import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    try {
      const res = await axios.get('/api/users/my-auctions')
      setAuctions(res.data.data)
    } catch (error) {
      toast.error('Failed to fetch auctions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) {
      return
    }

    try {
      await axios.delete(`/api/auctions/${id}`)
      toast.success('Auction deleted successfully')
      fetchAuctions()
    } catch (error) {
      toast.error('Failed to delete auction')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Auctions</h1>
        <p className="text-gray-600">Manage your auctions</p>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">You haven't created any auctions yet</p>
          <Link
            to="/create-auction"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Auction
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {auction.image && (
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {auction.title}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded ${
                      auction.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {auction.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {auction.description}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(auction.currentPrice)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="mb-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Ends: {formatDate(auction.endTime)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/auction/${auction._id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(auction._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAuctions

