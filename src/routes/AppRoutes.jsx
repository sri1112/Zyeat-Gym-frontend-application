import { Routes, Route } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import OnboardingHome from '../components/OnboardingHome'
import Home from '../components/Home'
import Dashboard from '../components/Dashboard'
import Orders from '../components/Orders'
import Plans from '../components/Plans'
import Profile from '../components/Profile'
import ProductDetails from '../components/ProductDetails'
import Cart from '../components/Cart'
import Checkout from '../components/Checkout'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AllProducts from '../components/AllProducts'
import Payment from '../components/Payment'
import PaymentSuccess from '../components/PaymentSuccess'
import Subscription from '../components/Subscription'
import MealHistory from '../components/MealHistory'
import HealthInformation from '../components/HealthInformation'
import TermsConditions from '../components/TermsConditions'
import PrivacyPolicy from '../components/PrivacyPolicy'
import DeleteAccount from '../components/DeleteAccount'

export default function AppRoutes () {
  return (
    <Routes>
      {/* 🔓 Public Routes (Login) */}
      <Route element={<PublicRoute />}>
        <Route path='/' element={<OnboardingHome />} />
      </Route>

      {/* 🔐 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/plans' element={<Plans />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/product-details/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/subscriptions' element={<Subscription />} />
          <Route path='/meal-history' element={<MealHistory />} />
          <Route path='/health' element={<HealthInformation />} />
          <Route path='/terms' element={<TermsConditions />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/delete-account' element={<DeleteAccount />} />
        </Route>
      </Route>
    </Routes>
  )
}
