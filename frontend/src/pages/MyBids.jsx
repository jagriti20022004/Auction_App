import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MyBids = () => {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      const res = await axios.get('/api/users/my-bids')
      setBids(res.data.data)
    } catch (error) {
      console.error('Error fetching bids:', error)
    } finally {
      setLoading(false)
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

  const isWinningBid = (bid) => {
    if (!bid.auction || !bid.auction.highestBidder) return false
    return bid.auction.highestBidder.toString() === bid.bidder.toString()
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
        <p className="text-gray-600">View all your bidding activity</p>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any bids yet</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      to={`/auction/${bid.auction._id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {bid.auction.title}
                    </Link>
                    {isWinningBid(bid) && bid.auction.status === 'active' && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Winning
                      </span>
                    )}
                    {isWinningBid(bid) && bid.auction.status === 'ended' && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Won
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{bid.auction.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {bid.auction.category}</span>
                    <span>Status: {bid.auction.status}</span>
                    <span>Placed: {formatDate(bid.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500 mb-1">Your Bid</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(bid.amount)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {formatPrice(bid.auction.currentPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBids

