import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const planService = {
  /**
   * Get All Plans
   */
  getPlans() {
    return apiRequest(API_ENDPOINTS.PLANS)
  },

  /**
   * Get Plan Details
   */
  getPlanById(planId) {
    return apiRequest(`${API_ENDPOINTS.PLANS}/${planId}`)
  }
}

export default planService