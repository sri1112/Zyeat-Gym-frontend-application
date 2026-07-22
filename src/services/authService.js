import { apiRequest } from '../api/api'
import { API_ENDPOINTS } from '../utils/constants'

const authService = {
  sendOtp (mobile) {
    return apiRequest(API_ENDPOINTS.AUTH.SEND_OTP, {
      method: 'POST',
      body: { mobile }
    })
  },

  verifyOtp (mobile, otp) {
    return apiRequest(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: {
        mobile,
        otp
      }
    })
  },

  getCurrentUser () {
    return apiRequest(API_ENDPOINTS.AUTH.ME)
  },

  updateProfile (data) {
    return apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: data
    })
  },

  logout () {
    return apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    })
  },
  deleteAccount () {
    return apiRequest(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      method: 'DELETE'
    })
  }
}

export default authService
