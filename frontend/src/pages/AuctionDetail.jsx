import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import io from 'socket.io-client'

const AuctionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    fetchAuction()

    // Setup socket connection
    if (user) {
      const token = localStorage.getItem('token')
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      })

      newSocket.on('connect', () => {
        newSocket.emit('join-auction', id)
      })

      newSocket.on('new-bid', (data) => {
        setBids((prev) => [data.bid, ...prev])
        setAuction((prev) => ({
          ...prev,
          currentPrice: data.currentPrice,
          highestBidder: data.bid.bidder._id,
          bidCount: prev.bidCount + 1
        }))
        toast.info(`New bid: $${data.currentPrice}`)
      })

      newSocket.on('bid-error', (data) => {
        toast.error(data.message)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [id, user])

  const fetchAuction = async () => {
    try {
      const res = await axios.get(`/api/auctions/${id}`)
      setAuction(res.data.data.auction)
      setBids(res.data.data.bids)
      setBidAmount((res.data.data.auction.currentPrice + 1).toFixed(2))
    } catch (error) {
      toast.error('Failed to fetch auction')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleBid = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login to place a bid')
      navigate('/login')
      return
    }

    const amount = parseFloat(bidAmount)

    if (amount <= auction.currentPrice) {
      toast.error('Bid must be higher than current price')
      return
    }

    if (socket) {
      socket.emit('place-bid', {
        auctionId: id,
        bidAmount: amount
      })
      setBidAmount((amount + 1).toFixed(2))
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

  const getTimeRemaining = (endTime) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days} days, ${hours} hours, ${minutes} minutes`
    if (hours > 0) return `${hours} hours, ${minutes} minutes`
    return `${minutes} minutes`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!auction) {
    return null
  }

  const isActive = auction.status === 'active' && new Date() < new Date(auction.endTime)
  const isSeller = user && auction.seller._id === user.id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {auction.image && (
            <img
              src={auction.image}
              alt={auction.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {auction.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {auction.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>
            <p className="text-gray-600 mb-6">{auction.description}</p>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Bidding History</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="text-gray-500">No bids yet</p>
                ) : (
                  bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{bid.bidder.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(bid.createdAt)}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(bid.amount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Current Price</p>
              <p className="text-4xl font-bold text-blue-600">
                {formatPrice(auction.currentPrice)}
              </p>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm text-gray-500">
                Starting Price: {formatPrice(auction.startingPrice)}
              </p>
              <p className="text-sm text-gray-500">
                Total Bids: {auction.bidCount}
              </p>
              <p className="text-sm text-gray-500">
                Ends: {formatDate(auction.endTime)}
              </p>
              <p className="text-sm font-medium text-red-600">
                {getTimeRemaining(auction.endTime)} remaining
              </p>
            </div>

            {isActive && !isSeller && (
              <form onSubmit={handleBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={auction.currentPrice + 1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum bid: {formatPrice(auction.currentPrice + 1)}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Place Bid
                </button>
              </form>
            )}

            {isSeller && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  This is your auction. You cannot bid on your own items.
                </p>
              </div>
            )}

            {!isActive && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-800">
                  This auction has ended.
                </p>
                {auction.highestBidder && (
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Winner: {auction.highestBidder.name}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-1">Seller</p>
              <p className="font-medium">{auction.seller.name}</p>
              <p className="text-sm text-gray-500">{auction.seller.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetail

