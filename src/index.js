import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
root.render(<App />)
// Add this right below your imports!
const originalError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ResizeObserver loop limit exceeded') ||
      args[0].includes(
        'ResizeObserver loop completed with undelivered notifications.'
      ))
  ) {
    return // Quietly ignore this specific error
  }
  originalError.call(console, ...args)
}

window.addEventListener('error', e => {
  if (
    e.message === 'ResizeObserver loop limit exceeded' ||
    e.message ===
      'ResizeObserver loop completed with undelivered notifications.'
  ) {
    const resizeObserverErrDiv = document.getElementById(
      'webpack-dev-server-client-overlay-div'
    )
    const resizeObserverErr = document.getElementById(
      'webpack-dev-server-client-overlay'
    )
    if (resizeObserverErr) {
      resizeObserverErr.setAttribute('style', 'display: none')
    }
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.setAttribute('style', 'display: none')
    }
  }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
