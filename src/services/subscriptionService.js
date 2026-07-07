import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const subscriptionService = {
  getActiveSubscription () {
    return apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/active`)
  },
  getTodayMeals () {
    return apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/today`)
  },

  getMealHistory () {
    return apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/history`)
  },

  consumeMeal (mappingId) {
    return apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/consume`, {
      method: 'PATCH',
      body: {
        mapping_id: mappingId
      }
    })
  },

  skipMeal (mappingId) {
    return apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/skip`, {
      method: 'PATCH',
      body: {
        mapping_id: mappingId
      }
    })
  }
}

export default subscriptionService
