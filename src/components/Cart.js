import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cartService from '../services/cartService'

export default function Cart () {
  const navigate = useNavigate()

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  /**
   * Fetch Cart
   */
  const loadCart = async () => {
    try {
      setLoading(true)

      const response = await cartService.getCart()

      if (response.success) {
        setCart(response.cart)
      } else {
        setCart(null)
      }
    } catch (err) {
      console.error('Load Cart Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  /**
   * Increase Quantity
   */
  const increaseQuantity = async item => {
    try {
      setActionLoading(true)

      await cartService.updateQuantity({
        mapping_id: item.mapping_id,
        quantity: item.quantity + 1
      })

      await loadCart()
    } catch (err) {
      console.error(err)
      alert('Unable to update quantity')
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Decrease Quantity
   */
  const decreaseQuantity = async item => {
    if (item.quantity <= 1) return

    try {
      setActionLoading(true)

      await cartService.updateQuantity({
        mapping_id: item.mapping_id,
        quantity: item.quantity - 1
      })

      await loadCart()
    } catch (err) {
      console.error(err)
      alert('Unable to update quantity')
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Remove Product
   */
  const removeProduct = async mappingId => {
    if (!window.confirm('Remove this meal?')) return

    try {
      setActionLoading(true)

      await cartService.removeItem(mappingId)

      await loadCart()
    } catch (err) {
      console.error(err)
      alert('Unable to remove meal')
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Clear Cart
   */
  const clearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return

    try {
      setActionLoading(true)

      await cartService.clearCart()

      await loadCart()
    } catch (err) {
      console.error(err)
      alert('Unable to clear cart')
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Loading
   */
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto'></div>

          <p className='mt-4 font-semibold text-gray-600'>
            Loading your cart...
          </p>
        </div>
      </div>
    )
  }

  /**
   * Empty Cart
   */
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center px-6'>
        <div className='text-7xl mb-6'>🛒</div>

        <h2 className='text-2xl font-bold'>Your Cart is Empty</h2>

        <p className='text-gray-500 text-center mt-2 mb-6'>
          Add your favourite healthy meals to begin your fitness journey.
        </p>

        <button
          onClick={() => navigate('/products')}
          className='bg-[#FF7043] text-white px-8 py-3 rounded-xl font-bold'
        >
          Browse Products
        </button>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-100 pt-16 pb-24'>
      {/* Header */}
      <div className='bg-white shadow-sm px-5 py-4 sticky top-0 z-10'>
        <h1 className='text-2xl font-bold text-gray-800'>My Cart</h1>

        <p className='text-sm text-gray-500'>
          {cart.items.length} Item{cart.items.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Cart Items */}
      <div className='p-4 space-y-4'>
        {cart.items.map(item => (
          <div
            key={item.mapping_id}
            className='bg-white rounded-2xl shadow-md overflow-hidden'
          >
            <div className='flex p-4'>
              {/* Product Image */}
              <img
                src={
                  item.image
                    ? `${process.env.REACT_APP_BASE_URL}${item.image}`
                    : '/placeholder-food.jpg'
                }
                alt={item.product_name}
                className='w-24 h-24 rounded-xl object-cover border'
                onError={e => {
                  // Check if we are ALREADY trying to load the placeholder
                  if (!e.target.src.includes('placeholder-food.jpg')) {
                    e.target.onerror = null // Kill the event
                    e.target.src = '/placeholder-food.jpg' // Set fallback
                  }
                }}
              />

              {/* Details */}
              <div className='flex-1 ml-4'>
                <div className='flex justify-between'>
                  <h2 className='font-bold text-lg leading-5'>
                    {item.product_name}
                  </h2>

                  <button
                    onClick={() => removeProduct(item.mapping_id)}
                    disabled={actionLoading}
                    className='text-red-500 text-sm font-semibold'
                  >
                    Remove
                  </button>
                </div>

                <p className='text-gray-500 text-sm mt-1'>{item.plan_name}</p>

                <div className='mt-2 space-y-1'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500'>Delivery</span>

                    <span className='font-medium'>{item.selected_date}</span>
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500'>Meal</span>

                    <span className='font-medium'>{item.period}</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className='flex justify-between items-center mt-4'>
                  <div className='flex items-center bg-gray-100 rounded-full'>
                    <button
                      onClick={() => decreaseQuantity(item)}
                      disabled={actionLoading}
                      className='w-9 h-9 text-xl font-bold'
                    >
                      −
                    </button>

                    <span className='w-10 text-center font-bold'>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item)}
                      disabled={actionLoading}
                      className='w-9 h-9 text-xl font-bold text-orange-500'
                    >
                      +
                    </button>
                  </div>

                  <div className='text-right'>
                    <p className='text-xs text-gray-500'>
                      ₹{item.unit_price} each
                    </p>

                    <h3 className='text-xl font-bold text-[#FF7043]'>
                      ₹{item.total_amount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className='fixed bottom-16 left-0 right-0 bg-white border-t shadow-2xl'>
        <div className='max-w-md mx-auto px-5 py-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-500'>Total Items</span>

            <span className='font-semibold'>
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-500'>Sub Total</span>

            <span className='font-semibold'>₹{cart.total}</span>
          </div>

          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-500'>Delivery</span>

            <span className='text-green-600 font-semibold'>FREE</span>
          </div>

          <hr className='my-3' />

          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Grand Total</h2>

            <h2 className='text-2xl font-bold text-[#FF7043]'>₹{cart.total}</h2>
          </div>

          <div className='space-y-3'>
            <button
              onClick={clearCart}
              disabled={actionLoading}
              className='w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition'
            >
              {actionLoading ? 'Processing...' : 'Clear Cart'}
            </button>

            <button
              onClick={() => navigate('/checkout')}
              disabled={actionLoading}
              className='w-full py-4 rounded-xl bg-[#FF7043] text-white font-bold text-lg hover:bg-[#F4511E] transition'
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
