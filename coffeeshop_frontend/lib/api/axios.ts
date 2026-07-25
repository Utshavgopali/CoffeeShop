import axios from 'axios'

// All requests go through /api/* which Next.js proxies to port 5001.
// withCredentials lets the browser send the httpOnly auth cookie.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default api
