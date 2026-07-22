import React, { useState } from 'react'
import fallbackFood from '../assests/food2.jpeg'
import { toast } from 'react-toastify'

const AddToCartModal = ({ product, onClose, onConfirm }) => {
  /*
   * DATABASE VALUES
   *
   * quantity     -> 10 / 100 / 2
   * product_unit -> grams / pieces
   */
  console.log(' product timings :: ', product)
  const baseQuantity =
    Number(product?.quantity ?? product?.product_quantity) || 1

  const rawUnit = String(
    product?.product_unit ?? product?.productUnit ?? product?.unit ?? 'grams'
  ).toLowerCase()

  const isPieces =
    rawUnit === 'piece' ||
    rawUnit === 'pieces' ||
    rawUnit === 'pcs' ||
    rawUnit === 'pc'

  /*
   * Default value comes directly from database
   */
  const [quantity, setQuantity] = useState(baseQuantity)

  // const [selectedTime, setSelectedTime] = useState('Morning')
  const [selectedTime, setSelectedTime] = useState(() => {
    if (product?.morningAvailable) return 'Morning'
    if (product?.eveningAvailable) return 'Evening'
    return null
  })

  if (!product) return null

  /*
   * Increment / Decrement
   *
   * grams:
   * DB quantity 10
   * 10 -> 20 -> 30
   *
   * pieces:
   * DB quantity 2
   * 2 -> 3 -> 4
   */
  const quantityStep = isPieces ? 1 : baseQuantity

  const minimumQuantity = baseQuantity

  /*
   * Maximum is 10 times the database quantity
   */
  const maximumQuantity = baseQuantity * 10

  const displayUnit = isPieces ? 'pcs' : 'g'

  const fullUnit = isPieces ? 'pieces' : 'grams'

  const handleIncrement = () => {
    setQuantity(prev => {
      const nextQuantity = prev + quantityStep

      return Math.min(nextQuantity, maximumQuantity)
    })
  }

  const handleDecrement = () => {
    setQuantity(prev => {
      const nextQuantity = prev - quantityStep

      return Math.max(nextQuantity, minimumQuantity)
    })
  }

  const handleConfirm = () => {
    if (!selectedTime) {
      toast.error('This product is not available for Morning or Evening.')
      return
    }
    onConfirm({
      quantity,
      unit: fullUnit,
      time: selectedTime
    })
  }

  return (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black/60 z-40' onClick={onClose} />

      {/* Bottom Sheet */}
      <div className='fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[26px] px-4 pt-3 pb-7 shadow-2xl animate-slide-up'>
        {/* Handle */}
        <div className='w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3' />

        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-[17px] font-bold text-gray-900'>
            {product.name || 'Meal'}
          </h2>

          <button
            type='button'
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-500'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Product Information */}
        <div className='flex gap-3 mb-6'>
          {/* Image */}
          <div className='w-[82px] h-[82px] shrink-0 rounded-full overflow-hidden bg-gray-100'>
            <img
              src={product.imageUrl || fallbackFood}
              alt={product.name}
              className='w-full h-full object-cover'
              onError={e => {
                e.currentTarget.src = fallbackFood
              }}
            />
          </div>

          {/* Details */}
          <div className='flex-1 min-w-0'>
            {/* Nutrition Badges */}
            <div className='flex flex-wrap gap-1.5 mb-2'>
              <span className='px-2 py-1 text-[9px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md'>
                🔥 {product.calories ?? 0} kcal
              </span>

              {product.protein != null && (
                <span className='px-2 py-1 text-[9px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md'>
                  💪 {product.protein}g Protein
                </span>
              )}

              {product.carbs != null && (
                <span className='px-2 py-1 text-[9px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md'>
                  🌾 {product.carbs}g Carbs
                </span>
              )}
            </div>

            <p className='text-[11px] leading-[16px] text-gray-500 line-clamp-3'>
              {product.description ||
                'Fresh and healthy meal selected for your plan.'}
            </p>
          </div>
        </div>

        {/* Time Title */}
        <h3 className='text-[12px] font-bold text-gray-900 mb-2'>
          Select Time for {product.name}
        </h3>

        {/* Time Options */}
        <div className='grid grid-cols-2 gap-3 mb-6'>
          {/* Morning */}
          <button
            type='button'
            disabled={!product.morningAvailable}
            onClick={() => setSelectedTime('Morning')}
            className={`h-[58px] px-3 rounded-xl border flex items-center justify-between transition
  ${
    !product.morningAvailable
      ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
      : selectedTime === 'Morning'
      ? 'border-[#065c2d] bg-[#f3fbf5]'
      : 'border-gray-200 bg-white'
  }`}
          >
            <div className='flex items-center gap-2'>
              <span className='text-base'>🌤️</span>

              <div className='text-left'>
                <p className='text-[11px] font-bold text-gray-900'>Morning</p>

                <p className='text-[8px] text-gray-400 mt-0.5'>
                  (6 AM - 12 PM)
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedTime === 'Morning'
                  ? 'border-[#065c2d]'
                  : 'border-gray-300'
              }`}
            >
              {selectedTime === 'Morning' && (
                <div className='w-2 h-2 rounded-full bg-[#065c2d]' />
              )}
            </div>
          </button>

          {/* Evening */}
          <button
            type='button'
            disabled={!product.eveningAvailable}
            onClick={() => setSelectedTime('Evening')}
            className={`h-[58px] px-3 rounded-xl border flex items-center justify-between transition
  ${
    !product.eveningAvailable
      ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
      : selectedTime === 'Evening'
      ? 'border-[#065c2d] bg-[#f3fbf5]'
      : 'border-gray-200 bg-white'
  }`}
          >
            <div className='flex items-center gap-2'>
              <span className='text-base'>🌙</span>

              <div className='text-left'>
                <p className='text-[11px] font-bold text-gray-900'>Evening</p>

                <p className='text-[8px] text-gray-400 mt-0.5'>(4 PM - 9 PM)</p>
              </div>
            </div>

            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedTime === 'Evening'
                  ? 'border-[#065c2d]'
                  : 'border-gray-300'
              }`}
            >
              {selectedTime === 'Evening' && (
                <div className='w-2 h-2 rounded-full bg-[#065c2d]' />
              )}
            </div>
          </button>
          {!product.morningAvailable && !product.eveningAvailable && (
            <p className='text-red-500 text-xs mt-2'>
              This product is currently unavailable.
            </p>
          )}
        </div>

        {/* Quantity Header */}
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-[12px] font-bold text-gray-900'>
            Select Quantity
          </h3>

          <span className='text-[10px] text-gray-400'>
            Min {minimumQuantity}
            {displayUnit} - Max {maximumQuantity}
            {displayUnit}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className='flex items-center justify-between mb-6'>
          {/* Minus */}
          <button
            type='button'
            onClick={handleDecrement}
            disabled={quantity <= minimumQuantity}
            className='w-10 h-10 rounded-xl border-[1.5px] border-[#7fbd91] flex items-center justify-center text-[#065c2d] text-xl font-medium disabled:opacity-40'
          >
            −
          </button>

          {/* Quantity */}
          <div className='text-center'>
            <span className='text-[20px] font-bold text-gray-900'>
              {quantity}
              {displayUnit}
            </span>
          </div>

          {/* Plus */}
          <button
            type='button'
            onClick={handleIncrement}
            disabled={quantity >= maximumQuantity}
            className='w-10 h-10 rounded-xl border-[1.5px] border-[#7fbd91] flex items-center justify-center text-[#065c2d] text-xl font-medium disabled:opacity-40'
          >
            +
          </button>
        </div>

        {/* Add Button */}
        <button
          type='button'
          onClick={handleConfirm}
          className='w-full h-[52px] bg-[#005c24] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform'
        >
          Add to Plan
          <span className='text-green-200'>•</span>
          {quantity}
          {displayUnit}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }

          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s
            cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  )
}

export default AddToCartModal
