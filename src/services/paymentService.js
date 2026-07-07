import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const paymentService = {
  /**
   * Create Payment
   */
  createPayment (data) {
    return apiRequest(`${API_ENDPOINTS.PAYMENTS}/create`, {
      method: 'POST',
      body: data
    })
  },

  /**
   * Mark Payment Success
   */
  paymentSuccess (data) {
    return apiRequest(`${API_ENDPOINTS.PAYMENTS}/success`, {
      method: 'POST',
      body: data
    })
  },

  /**
   * Mark Payment Failed
   */
  paymentFailed (data) {
    return apiRequest(`${API_ENDPOINTS.PAYMENTS}/failure`, {
      method: 'POST',
      body: data
    })
  },

  /**
   * Get My Payments
   */
  getPayments () {
    return apiRequest(API_ENDPOINTS.PAYMENTS)
  },

  /**
   * Get Payment Details
   */
  getPaymentById (paymentId) {
    return apiRequest(`${API_ENDPOINTS.PAYMENTS}/${paymentId}`)
  }
}

export default paymentService
