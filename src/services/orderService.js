import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const orderService = {
  createOrder (data) {
    console.log('ORDER SERVICE RECEIVED:', data)

    return apiRequest(`${API_ENDPOINTS.ORDERS}/create`, {
      method: 'POST',
      body: data
    })
  },

  getOrders () {
    return apiRequest(API_ENDPOINTS.ORDERS)
  },

  getOrderDetails (orderId) {
    return apiRequest(`${API_ENDPOINTS.ORDERS}/${orderId}`)
  },
  reorderOrder (orderId) {
    return apiRequest(`${API_ENDPOINTS.ORDERS}/${orderId}/reorder`, {
      method: 'POST'
    })
  }
}

export default orderService
