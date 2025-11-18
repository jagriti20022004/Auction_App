import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      return { success: true }
    } catch (error) {
      // Better error handling
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Cannot connect to server. Make sure backend is running on port 5000.'
        }
      }
      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0]
        return {
          success: false,
          message: firstError.msg || 'Validation error'
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      return { success: true }
    } catch (error) {
      // Better error handling
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Cannot connect to server. Make sure backend is running on port 5000.'
        }
      }
      if (error.response?.data?.errors) {
        // Validation errors
        const firstError = error.response.data.errors[0]
        return {
          success: false,
          message: firstError.msg || 'Validation error'
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

