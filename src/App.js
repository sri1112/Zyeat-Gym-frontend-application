import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App () {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position='top-center'
          autoClose={2000}
          hideProgressBar
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
