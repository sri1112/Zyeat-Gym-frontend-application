const BASE_URL = 'http://localhost:3001/api'

export async function apiRequest (
  endpoint,
  { method = 'GET', body = null, headers = {} } = {}
) {
  const options = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body !== null && body !== undefined) {
    options.body = JSON.stringify(body)
  }

  console.log('API ENDPOINT:', endpoint)
  console.log('API OPTIONS:', options)
  console.log('API BODY:', options.body)

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}