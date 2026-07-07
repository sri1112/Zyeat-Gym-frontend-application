import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const cartService = {
  createCart () {
    return apiRequest(`${API_ENDPOINTS.CART}/create`, {
      method: 'POST'
    })
  },

  getCart () {
    return apiRequest(API_ENDPOINTS.CART)
  },

  addToCart (data) {
    return apiRequest(`${API_ENDPOINTS.CART}/add-product`, {
      method: 'POST',
      body: data
    })
  },

  updateQuantity (data) {
    return apiRequest(`${API_ENDPOINTS.CART}/update-product`, {
      method: 'PUT',
      body: data
    })
  },

  removeItem (mappingId) {
    return apiRequest(`${API_ENDPOINTS.CART}/remove-product/${mappingId}`, {
      method: 'DELETE'
    })
  },

  clearCart () {
    return apiRequest(`${API_ENDPOINTS.CART}/clear`, {
      method: 'DELETE'
    })
  }
}

export default cartService
