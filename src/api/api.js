// apiRequest.js
const BASE_URL = process.env.REACT_APP_API_URL

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

  const url = `${BASE_URL}${endpoint}`
  console.log('API REQUEST:', method, url)

  let response
  try {
    response = await fetch(url, options)
  } catch (error) {
    console.error('NETWORK ERROR:', error)
    throw new Error('Cannot connect to the server. Please try again.')
  }

  const contentType = response.headers.get('content-type')
  let data

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()
    console.error('NON-JSON SERVER RESPONSE:', text)

    if (response.status === 503) {
      throw new Error(
        'Backend server is unavailable. Please restart the Node.js application.'
      )
    }
    throw new Error(`Server returned ${response.status} ${response.statusText}`)
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    )
  }

  return data
}
