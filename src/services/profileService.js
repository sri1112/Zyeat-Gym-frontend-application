import authService from './authService'

const profileService = {
  getProfile () {
    return authService.getCurrentUser()
  },

  updateProfile (data) {
    return authService.updateProfile(data)
  }
}

export default profileService
