// import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'

// import cartService from '../services/cartService'
// import fallbackFood from '../assests/food2.jpeg'

// const Plans = () => {
//   const navigate = useNavigate()
//   const location = useLocation()

//   /*
//    * =========================================================
//    * DATA FROM:
//    *
//    * HOME
//    * → ADD BUTTON
//    * → AddToCartModal
//    * → PLANS PAGE
//    *
//    * Expected:
//    *
//    * {
//    *   product,
//    *   plan,
//    *   quantity,
//    *   unit,
//    *   time
//    * }
//    * =========================================================
//    */

//   const navigationData = location.state || {}

//   const incomingProduct = navigationData.product || null
//   // const incomingPlan = navigationData.plan || null
//   const incomingPlan = navigationData.plan
//     ? {
//         ...navigationData.plan,

//         plan_id:
//           navigationData.plan.plan_id ||
//           navigationData.plan.planId ||
//           navigationData.plan.id ||
//           navigationData.plan._id ||
//           navigationData.planId ||
//           null,

//         id:
//           navigationData.plan.id ||
//           navigationData.plan.plan_id ||
//           navigationData.plan.planId ||
//           navigationData.plan._id ||
//           navigationData.planId ||
//           null
//       }
//     : navigationData.planId
//     ? {
//         plan_id: navigationData.planId,
//         id: navigationData.planId
//       }
//     : null
//   const incomingQuantity = Number(navigationData.quantity) || 1
//   const incomingUnit = navigationData.unit || 'grams'
//   const incomingTime = navigationData.time || 'Morning'

//   /*
//    * =========================================================
//    * MAIN DATA
//    * =========================================================
//    */

//   // const [product] = useState(incomingProduct)
//   const [selectedPlan, setSelectedPlan] = useState(incomingPlan)
//   const [activePlan, setActivePlan] = useState(incomingPlan)
//   const [quantity] = useState(incomingQuantity)
//   const [selectedUnit] = useState(incomingUnit)
//   const [selectedTime, setSelectedTime] = useState(incomingTime)
//   const [pendingProduct, setPendingProduct] = useState(incomingProduct)
//   const product = pendingProduct

//   /*
//    * =========================================================
//    * CART DATA
//    * =========================================================
//    */

//   const [cartId, setCartId] = useState(null)
//   const [cartItems, setCartItems] = useState([])

//   /*
//    * If existing cart returns these values,
//    * we lock the page to them.
//    */

//   const [cartPlanId, setCartPlanId] = useState(null)
//   const [cartPeriod, setCartPeriod] = useState(null)
//   const [cartStartDate, setCartStartDate] = useState(null)

//   /*
//    * =========================================================
//    * UI STATE
//    * =========================================================
//    */

//   // const [selectedDate, setSelectedDate] = useState(null)
//   // const [selectedDate, setSelectedDate] = useState(() => {
//   //   if (navigationData.selectedDate) {
//   //     return parseApiDate(navigationData.selectedDate)
//   //   }

//   //   return null
//   // })
//   const [selectedDate, setSelectedDate] = useState(() => {
//     const value = navigationData.selectedDate

//     if (!value) return null

//     const cleanDate = String(value).slice(0, 10)
//     const [year, month, day] = cleanDate.split('-').map(Number)

//     if (!year || !month || !day) return null

//     const date = new Date(year, month - 1, day)
//     date.setHours(0, 0, 0, 0)

//     return date
//   })
//   const [expandedDays, setExpandedDays] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [adding, setAdding] = useState(false)
//   const [removingId, setRemovingId] = useState(null)

//   /*
//    * =========================================================
//    * DATE HELPERS
//    * =========================================================
//    */

//   const formatDateForApi = date => {
//     if (!date) return ''

//     const year = date.getFullYear()

//     const month = String(date.getMonth() + 1).padStart(2, '0')

//     const day = String(date.getDate()).padStart(2, '0')

//     return `${year}-${month}-${day}`
//   }

//   const normalizeApiDate = value => {
//     if (!value) return ''

//     // MySQL DATE string
//     if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
//       return value
//     }

//     const date = new Date(value)

//     if (Number.isNaN(date.getTime())) {
//       return ''
//     }

//     return formatDateForApi(date)
//   }

//   const parseApiDate = value => {
//     if (!value) return null

//     const cleanDate = normalizeApiDate(value)

//     const [year, month, day] = cleanDate.split('-').map(Number)

//     if (!year || !month || !day) {
//       return null
//     }

//     const date = new Date(year, month - 1, day)

//     date.setHours(0, 0, 0, 0)

//     return date
//   }

//   /*
//    * =========================================================
//    * PRODUCT HELPERS
//    * =========================================================
//    */

//   const getProductId = value => {
//     return value?.product_id || value?.id || value?._id || null
//   }

//   const getProductName = value => {
//     return value?.product_name || value?.name || value?.product?.name || 'Meal'
//   }

//   const getProductImage = value => {
//     return (
//       value?.imageUrl ||
//       value?.image_url ||
//       value?.product_image ||
//       value?.image ||
//       value?.product?.imageUrl ||
//       fallbackFood
//     )
//   }

//   const getProductPrice = value => {
//     return Number(
//       value?.unit_price ??
//         value?.price ??
//         value?.selling_price ??
//         value?.product_price ??
//         value?.product?.price ??
//         0
//     )
//   }

//   const getItemQuantity = value => {
//     return Number(value?.quantity ?? 1)
//   }

//   const getMappingId = value => {
//     return (
//       value?.mapping_id ||
//       value?.mappingId ||
//       value?.cart_product_mapping_id ||
//       value?.cart_product_id ||
//       value?.id ||
//       null
//     )
//   }

//   /*
//    * =========================================================
//    * PLAN HELPERS
//    * =========================================================
//    */

//   const getPlanId = plan => {
//     if (!plan) return null

//     return plan.plan_id || plan.planId || plan.id || plan._id || null
//   }

//   const getPlanName = plan => {
//     return plan?.plan_name || plan?.name || 'Plan'
//   }

//   const getPlanDuration = plan => {
//     const possibleDuration =
//       plan?.duration ??
//       plan?.plan_duration ??
//       plan?.total_days ??
//       plan?.days ??
//       plan?.number_of_days

//     const numericDuration = Number(possibleDuration)

//     if (numericDuration > 0) {
//       return numericDuration
//     }

//     const planName = String(getPlanName(plan)).toLowerCase()

//     if (planName.includes('7')) {
//       return 7
//     }

//     return 3
//   }

//   /*
//    * =========================================================
//    * PERIOD HELPERS
//    * =========================================================
//    */

//   const convertTimeToPeriod = time => {
//     return time === 'Morning' ? 'PRE_WORKOUT' : 'POST_WORKOUT'
//   }

//   const convertPeriodToTime = period => {
//     const normalizedPeriod = String(period || '').toUpperCase()

//     if (normalizedPeriod === 'PRE_WORKOUT' || normalizedPeriod === 'MORNING') {
//       return 'Morning'
//     }

//     return 'Evening'
//   }

//   const incomingPlanId = getPlanId(incomingPlan)
//   const incomingPlanName = getPlanName(incomingPlan)
//   const incomingProductId = getProductId(incomingProduct)
//   const incomingPlanStartDate = navigationData.planStartDate || null

//   /*
//    * =========================================================
//    * LOAD CART
//    * =========================================================
//    */

//   const loadCart = useCallback(async () => {
//     try {
//       const response = await cartService.getCart()

//       console.log('CART RESPONSE:', response)

//       const cart = response?.cart || response?.data?.cart || null

//       if (!cart) {
//         setCartId(null)
//         setCartItems([])
//         return null
//       }

//       const items = Array.isArray(cart.items) ? cart.items : []

//       setCartId(cart.cart_id || cart.id || null)
//       setCartItems(items)

//       /*
//        * IMPORTANT:
//        * When product comes from Home → Modal → Plans,
//        * always keep that selected plan and time.
//        *
//        * Do not use items[0], because items[0] can belong
//        * to another plan or another period.
//        */

//       const incomingPlanName = getPlanName(incomingPlan)

//       const incomingPeriod = convertTimeToPeriod(incomingTime)

//       /*
//        * Find an existing item matching the plan
//        * selected by the user.
//        */

//       const matchingItem = items.find(item => {
//         const itemPlanName = String(item.plan_name || '')
//           .trim()
//           .toLowerCase()

//         const wantedPlanName = String(incomingPlanName || '')
//           .trim()
//           .toLowerCase()

//         const samePlan = itemPlanName === wantedPlanName

//         const samePeriod =
//           String(item.period || '').toUpperCase() ===
//           String(incomingPeriod).toUpperCase()

//         return samePlan && samePeriod
//       })

//       /*
//        * DIRECT PLAN PAGE:
//        * If there is no incoming plan,
//        * only then use an existing cart item.
//        */

//       const referenceItem = incomingPlan ? matchingItem : items[0] || null

//       /*
//        * RESOLVE PLAN
//        */

//       const resolvedPlanName = incomingPlan
//         ? incomingPlanName
//         : referenceItem?.plan_name || 'Plan'

//       const resolvedPlanId =
//         getPlanId(incomingPlan) ||
//         (Number(cart.plan_id) > 0 ? Number(cart.plan_id) : null)

//       const resolvedDuration = String(resolvedPlanName)
//         .toLowerCase()
//         .includes('7')
//         ? 7
//         : 3

//       const resolvedPlan = {
//         ...(incomingPlan || {}),
//         plan_id: resolvedPlanId,
//         id: resolvedPlanId,
//         plan_name: resolvedPlanName,
//         name: resolvedPlanName,
//         duration: resolvedDuration
//       }

//       // setActivePlan(resolvedPlan)
//       // setSelectedPlan(resolvedPlan)
//       setActivePlan(previous => {
//         const previousId = getPlanId(previous)
//         const nextId = getPlanId(resolvedPlan)

//         if (
//           previousId === nextId &&
//           getPlanName(previous) === getPlanName(resolvedPlan)
//         ) {
//           return previous
//         }

//         return resolvedPlan
//       })

//       setSelectedPlan(previous => {
//         const previousId = getPlanId(previous)
//         const nextId = getPlanId(resolvedPlan)

//         if (
//           previousId === nextId &&
//           getPlanName(previous) === getPlanName(resolvedPlan)
//         ) {
//           return previous
//         }

//         return resolvedPlan
//       })

//       if (resolvedPlanId) {
//         setCartPlanId(resolvedPlanId)
//       }

//       /*
//        * RESOLVE PERIOD
//        *
//        * Product Add flow:
//        * use time selected in AddToCartModal.
//        *
//        * Direct Plan page:
//        * use existing cart item.
//        */

//       const resolvedPeriod = incomingProduct
//         ? incomingPeriod
//         : referenceItem?.period || null

//       if (resolvedPeriod) {
//         setCartPeriod(resolvedPeriod)
//         setSelectedTime(convertPeriodToTime(resolvedPeriod))
//       }

//       /*
//        * PLAN START DATE
//        *
//        * Filter by BOTH:
//        * 1. plan_name
//        * 2. period
//        *
//        * Never use all cart products.
//        */

//       setCartStartDate(previousStartDate => {
//         if (previousStartDate) {
//           return previousStartDate
//         }

//         if (navigationData.planStartDate) {
//           return normalizeApiDate(navigationData.planStartDate)
//         }

//         const currentPlanItems = items.filter(item => {
//           const samePlan =
//             String(item.plan_name || '')
//               .trim()
//               .toLowerCase() ===
//             String(resolvedPlanName || '')
//               .trim()
//               .toLowerCase()

//           const samePeriod =
//             String(item.period || '').toUpperCase() ===
//             String(resolvedPeriod || '').toUpperCase()

//           return samePlan && samePeriod
//         })

//         const dates = currentPlanItems
//           .map(item =>
//             parseApiDate(item.selected_date || item.date || item.delivery_date)
//           )
//           .filter(Boolean)
//           .sort((first, second) => first.getTime() - second.getTime())

//         if (dates.length > 0) {
//           return formatDateForApi(dates[0])
//         }

//         return formatDateForApi(new Date())
//       })

//       return cart
//     } catch (error) {
//       console.error('Get cart error:', error)

//       return null
//     }
//   }, [
//     incomingPlanId,
//     incomingPlanName,
//     incomingProductId,
//     incomingTime,
//     incomingPlanStartDate
//   ])

//   /*
//    * =========================================================
//    * INITIAL LOAD
//    * =========================================================
//    */

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         setLoading(true)

//         await loadCart()
//       } finally {
//         setLoading(false)
//       }
//     }

//     initialize()
//   }, [loadCart])

//   /*
//    * =========================================================
//    * EFFECTIVE PLAN
//    *
//    * If existing cart has plan_id:
//    * use that plan.
//    *
//    * Otherwise:
//    * use plan received from Home.
//    * =========================================================
//    */

//   const effectivePlan = activePlan || selectedPlan || incomingPlan

//   // const effectivePlanId = cartPlanId || getPlanId(effectivePlan)
//   const effectivePlanId =
//     getPlanId(effectivePlan) ||
//     getPlanId(incomingPlan) ||
//     navigationData.planId ||
//     cartPlanId ||
//     null

//   const planDuration = getPlanDuration(effectivePlan)

//   /*
//    * =========================================================
//    * EFFECTIVE PERIOD
//    *
//    * One plan has only one:
//    *
//    * PRE_WORKOUT
//    * OR
//    * POST_WORKOUT
//    * =========================================================
//    */

//   const effectivePeriod = cartPeriod || convertTimeToPeriod(selectedTime)

//   const displayTime = convertPeriodToTime(effectivePeriod)

//   /*
//    * =========================================================
//    * PLAN START DATE
//    *
//    * Existing cart:
//    * use backend start date.
//    *
//    * New cart:
//    * use today.
//    * =========================================================
//    */

//   // const planStartDate = useMemo(() => {
//   //   if (cartStartDate) {
//   //     const parsedDate = parseApiDate(cartStartDate)

//   //     if (parsedDate) {
//   //       return parsedDate
//   //     }
//   //   }

//   //   const today = new Date()

//   //   today.setHours(0, 0, 0, 0)

//   //   return today
//   // }, [cartStartDate])
//   const [planStartDate, setPlanStartDate] = useState(() => {
//     if (cartStartDate) {
//       const parsed = parseApiDate(cartStartDate)
//       if (parsed) return parsed
//     }

//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     return today
//   })

//   /*
//    * =========================================================
//    * DYNAMIC 3 DAYS / 7 DAYS
//    * =========================================================
//    */

//   const planDates = useMemo(() => {
//     return Array.from({ length: planDuration }, (_, index) => {
//       const date = new Date(planStartDate)
//       date.setDate(planStartDate.getDate() + index)
//       return date
//     })
//   }, [planDuration, planStartDate])

//   const planDateStrings = useMemo(() => {
//     return planDates.map(date => formatDateForApi(date))
//   }, [planDates])

//   /*
//    * =========================================================
//    * SELECT FIRST DATE AUTOMATICALLY
//    * =========================================================
//    */

//   useEffect(() => {
//     if (planDates.length > 0 && !selectedDate) {
//       const firstDate = new Date(planDates[0])

//       setSelectedDate(firstDate)

//       setExpandedDays([formatDateForApi(firstDate)])
//     }
//   }, [planDates, selectedDate])

//   /*
//    * =========================================================
//    * CALENDAR
//    * =========================================================
//    */

//   const [calendarMonth, setCalendarMonth] = useState(() => new Date())

//   useEffect(() => {
//     if (selectedDate) {
//       setCalendarMonth(
//         new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
//       )
//     }
//   }, [selectedDate])

//   const daysInMonth = new Date(
//     calendarMonth.getFullYear(),
//     calendarMonth.getMonth() + 1,
//     0
//   ).getDate()

//   const firstDayOfMonth = new Date(
//     calendarMonth.getFullYear(),
//     calendarMonth.getMonth(),
//     1
//   ).getDay()

//   const isDateInsidePlan = date => {
//     const dateString = formatDateForApi(date)

//     return planDateStrings.includes(dateString)
//   }

//   // const handleSelectDate = date => {
//   //   if (!isDateInsidePlan(date)) {
//   //     return
//   //   }

//   //   const selected = new Date(date)

//   //   selected.setHours(0, 0, 0, 0)

//   //   setSelectedDate(selected)

//   //   const dateString = formatDateForApi(selected)

//   //   setExpandedDays(previous => {
//   //     if (previous.includes(dateString)) {
//   //       return previous
//   //     }

//   //     return [...previous, dateString]
//   //   })
//   // }

//   useEffect(() => {
//     if (!cartStartDate) return

//     const parsed = parseApiDate(cartStartDate)

//     if (parsed) {
//       setPlanStartDate(parsed)
//     }
//   }, [cartStartDate])
//   const handleSelectDate = date => {
//     const newStart = new Date(date)
//     newStart.setHours(0, 0, 0, 0)

//     setSelectedDate(newStart)

//     // Shift the entire plan
//     setPlanStartDate(newStart)

//     setExpandedDays(
//       Array.from({ length: planDuration }, (_, index) => {
//         const d = new Date(newStart)
//         d.setDate(newStart.getDate() + index)
//         return formatDateForApi(d)
//       })
//     )
//   }
//   const handlePreviousMonth = () => {
//     setCalendarMonth(previous => {
//       return new Date(previous.getFullYear(), previous.getMonth() - 1, 1)
//     })
//   }

//   const handleNextMonth = () => {
//     setCalendarMonth(previous => {
//       return new Date(previous.getFullYear(), previous.getMonth() + 1, 1)
//     })
//   }

//   /*
//    * =========================================================
//    * PLAN ITEMS ONLY
//    * =========================================================
//    */

//   const planItems = useMemo(() => {
//     const activePlanName = String(getPlanName(effectivePlan))
//       .trim()
//       .toLowerCase()

//     const activePeriod = String(effectivePeriod).toUpperCase()

//     return cartItems.filter(item => {
//       const itemDate = normalizeApiDate(
//         item.selected_date || item.date || item.delivery_date
//       )

//       const itemPlanName = String(item.plan_name || '')
//         .trim()
//         .toLowerCase()

//       const itemPeriod = String(item.period || '').toUpperCase()

//       const dateMatches = planDateStrings.includes(itemDate)

//       const planMatches = itemPlanName === activePlanName

//       const periodMatches = itemPeriod === activePeriod

//       return dateMatches && planMatches && periodMatches
//     })
//   }, [cartItems, planDateStrings, effectivePlan, effectivePeriod])

//   /*
//    * =========================================================
//    * GROUP PRODUCTS DATE-WISE
//    * =========================================================
//    */

//   const groupedProducts = useMemo(() => {
//     return planItems.reduce((groups, item) => {
//       const itemDate = normalizeApiDate(
//         item.selected_date || item.date || item.delivery_date
//       )

//       if (!itemDate) {
//         return groups
//       }

//       if (!groups[itemDate]) {
//         groups[itemDate] = []
//       }

//       groups[itemDate].push(item)

//       return groups
//     }, {})
//   }, [planItems])

//   /*
//    * =========================================================
//    * TOTALS
//    * =========================================================
//    */

//   const getItemTotal = item => {
//     if (item?.total_amount != null) {
//       return Number(item.total_amount)
//     }

//     return getProductPrice(item) * getItemQuantity(item)
//   }

//   const currentPlanTotal = planItems.reduce((total, item) => {
//     return total + getItemTotal(item)
//   }, 0)

//   const productPrice = getProductPrice(product)

//   const selectedProductTotal = productPrice * quantity

//   const projectedTotal = currentPlanTotal + selectedProductTotal

//   /*
//    * =========================================================
//    * ADD PRODUCT DATE-WISE
//    * =========================================================
//    */

//   const handleAddToPlan = async () => {
//     if (!product) {
//       alert('Product is missing.')

//       return
//     }

//     if (!effectivePlanId) {
//       alert('Plan is missing.')

//       return
//     }

//     if (!selectedDate) {
//       alert('Please select a delivery date.')

//       return
//     }

//     try {
//       setAdding(true)

//       let currentCartId = cartId

//       /*
//        * CREATE CART ONLY WHEN
//        * THERE IS NO EXISTING CART
//        */

//       if (!currentCartId) {
//         const cartResponse = await cartService.createCart()

//         const createdCart =
//           cartResponse?.cart || cartResponse?.data?.cart || cartResponse

//         currentCartId = createdCart?.cart_id || createdCart?.id || null

//         if (!currentCartId) {
//           throw new Error('Cart ID was not returned.')
//         }

//         setCartId(currentCartId)
//       }

//       const payload = {
//         cart_id: currentCartId,

//         product_id: getProductId(product),

//         plan_id: effectivePlanId,

//         selected_date: formatDateForApi(selectedDate),

//         period: effectivePeriod,

//         quantity: Number(quantity),

//         product_unit: selectedUnit
//       }

//       console.log('ADD DATE-WISE PRODUCT:', payload)

//       await cartService.addToCart(payload)

//       /*
//        * REFRESH EVERYTHING DYNAMICALLY
//        */

//       await loadCart()
//       setPendingProduct(null)
//       const dateString = formatDateForApi(selectedDate)

//       setExpandedDays(previous => {
//         if (previous.includes(dateString)) {
//           return previous
//         }

//         return [...previous, dateString]
//       })
//     } catch (error) {
//       console.error('Add product error:', error)

//       alert(
//         error?.response?.data?.message ||
//           error?.message ||
//           'Failed to add product.'
//       )
//     } finally {
//       setAdding(false)
//     }
//   }
//   // const handleAddProductForDate = dateString => {
//   //   const planId = getPlanId(effectivePlan)

//   //   console.log('OPEN PRODUCTS PLAN:', {
//   //     effectivePlan,
//   //     planId,
//   //     dateString
//   //   })

//   //   navigate('/products', {
//   //     state: {
//   //       addToPlanMode: true,

//   //       plan: {
//   //         ...effectivePlan,
//   //         plan_id: planId,
//   //         id: planId
//   //       },

//   //       planId,

//   //       selectedDate: dateString,

//   //       planStartDate: formatDateForApi(planStartDate),

//   //       time: displayTime,

//   //       period: effectivePeriod
//   //     }
//   //   })
//   // }
//   const handleAddProductForDate = dateString => {
//     if (!effectivePlanId) {
//       alert('Plan ID is missing.')
//       return
//     }

//     navigate('/products', {
//       state: {
//         addToPlanMode: true,

//         plan: {
//           ...effectivePlan,
//           plan_id: effectivePlanId,
//           id: effectivePlanId
//         },

//         planId: effectivePlanId,

//         selectedDate: dateString,

//         planStartDate: formatDateForApi(planStartDate),

//         time: displayTime,

//         period: effectivePeriod
//       }
//     })
//   }
//   /*
//    * =========================================================
//    * REMOVE PRODUCT FROM EXACT DATE
//    * =========================================================
//    */

//   const handleRemoveProduct = async item => {
//     const mappingId = getMappingId(item)

//     if (!mappingId) {
//       alert('Product mapping ID is missing.')

//       return
//     }

//     try {
//       setRemovingId(mappingId)

//       await cartService.removeItem(mappingId)

//       /*
//        * Refresh date-wise products,
//        * counts and totals.
//        */

//       await loadCart()
//     } catch (error) {
//       console.error('Remove product error:', error)

//       alert(
//         error?.response?.data?.message ||
//           error?.message ||
//           'Failed to remove product.'
//       )
//     } finally {
//       setRemovingId(null)
//     }
//   }

//   /*
//    * =========================================================
//    * EXPAND DATE
//    * =========================================================
//    */

//   const toggleDate = dateString => {
//     setExpandedDays(previous => {
//       if (previous.includes(dateString)) {
//         return previous.filter(value => value !== dateString)
//       }

//       return [...previous, dateString]
//     })
//   }

//   const handleOpenProducts = date => {
//     const dateString = formatDateForApi(date)

//     navigate('/products', {
//       state: {
//         fromPlan: true,

//         // Keep current plan
//         plan: effectivePlan,

//         // Exact date selected in Plan Overview
//         selectedDate: dateString,
//         planStartDate: formatDateForApi(planStartDate),

//         // Keep same Morning / Evening
//         time: displayTime,
//         period: effectivePeriod
//       }
//     })
//   }

//   /*
//    * =========================================================
//    *
//    * Every plan date must contain at least one product.
//    * =========================================================
//    */

//   const completedDatesCount = useMemo(() => {
//     return planDateStrings.filter(dateString => {
//       const products = groupedProducts[dateString] || []

//       return products.length > 0
//     }).length
//   }, [planDateStrings, groupedProducts])

//   const missingDates = useMemo(() => {
//     return planDateStrings.filter(dateString => {
//       const products = groupedProducts[dateString] || []

//       return products.length === 0
//     })
//   }, [planDateStrings, groupedProducts])

//   const isPlanComplete =
//     planDateStrings.length > 0 && completedDatesCount === planDateStrings.length

//   const selectedDateAlreadyHasProduct = selectedDate
//     ? (groupedProducts[formatDateForApi(selectedDate)] || []).length > 0
//     : false

//   const handleContinueToCheckout = () => {
//     if (!isPlanComplete) {
//       const firstMissingDate = missingDates[0]

//       alert(`Please add at least one product for ${firstMissingDate}.`)

//       return
//     }

//     navigate('/checkout', {
//       state: {
//         plan: effectivePlan,
//         planId: effectivePlanId,
//         planStartDate: formatDateForApi(planStartDate),
//         planEndDate: formatDateForApi(planDates[planDates.length - 1]),
//         totalDays: planDuration,
//         period: effectivePeriod,
//         time: displayTime,
//         completedDates: completedDatesCount,
//         total: currentPlanTotal
//       }
//     })
//   }
//   /*
//    * =========================================================
//    * LOADING
//    * =========================================================
//    */

//   if (loading) {
//     return (
//       <div className='fixed inset-0 z-[100] bg-white flex items-center justify-center'>
//         <div className='text-center'>
//           <div className='w-9 h-9 border-4 border-gray-200 border-t-[#065c2d] rounded-full animate-spin mx-auto' />

//           <p className='mt-3 text-[#065c2d] font-bold'>Loading Plan...</p>
//         </div>
//       </div>
//     )
//   }

//   const firstPlanDate = planDates[0]

//   const lastPlanDate = planDates[planDates.length - 1]

//   return (
//     <div className='fixed inset-0 z-[100] bg-black/50 flex justify-center items-end sm:items-center font-sans'>
//       <div className='w-full max-w-md h-[96vh] sm:h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden relative shadow-2xl'>
//         {/* HANDLE */}

//         <div className='w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3' />

//         {/* HEADER */}

//         <div className='px-5 py-4 flex items-center justify-between'>
//           <div className='flex items-center gap-3 min-w-0'>
//             {product && (
//               <div className='w-[68px] h-[68px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0'>
//                 <img
//                   src={getProductImage(product)}
//                   alt={getProductName(product)}
//                   className='w-full h-full object-cover'
//                   onError={event => {
//                     event.currentTarget.src = fallbackFood
//                   }}
//                 />
//               </div>
//             )}

//             <div className='min-w-0'>
//               <h2 className='text-[18px] font-bold text-gray-900 truncate'>
//                 {product
//                   ? `Add ${getProductName(product)}`
//                   : `${getPlanName(effectivePlan)} Information`}
//               </h2>

//               {product && (
//                 <>
//                   <p className='text-[13px] text-gray-500 mt-1'>
//                     {product.calories} kcal
//                   </p>

//                   <p className='text-[14px] font-bold text-[#07852d] mt-1'>
//                     Price ₹{product.price}
//                   </p>
//                 </>
//               )}
//             </div>
//           </div>

//           <button
//             type='button'
//             onClick={() => navigate(-1)}
//             className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'
//           >
//             ✕
//           </button>
//         </div>

//         {/* SCROLL BODY */}

//         <div className='h-[calc(100%-180px)] overflow-y-auto pb-28 scrollbar-hide'>
//           {/* PLAN INFORMATION */}

//           {/* <div className='px-5 mb-3'>
//             <div className='bg-[#F4FBF4] border border-[#07852d] rounded-xl p-4 flex justify-between items-center'>
//               <div>
//                 <p className='text-[11px] text-gray-500'>Active Plan</p>

//                 <p className='text-[15px] font-bold text-gray-900 mt-1'>
//                   {getPlanName(effectivePlan)}
//                 </p>
//               </div>

//               <div className='text-right'>
//                 <p className='text-[22px] font-extrabold text-[#07852d]'>
//                   {planDuration}
//                 </p>

//                 <p className='text-[10px] text-gray-500'>Days</p>
//               </div>
//             </div>
//           </div> */}

//           {/* SELECT DELIVERY DATE */}

//           <div className='px-5'>
//             <h3 className='text-[16px] font-bold text-gray-900'>
//               Select Delivery Date
//             </h3>

//             {/* MONTH */}

//             <div className='flex items-center justify-between mt-4 mb-3'>
//               <button
//                 type='button'
//                 onClick={handlePreviousMonth}
//                 className='text-[#07852d] text-2xl'
//               >
//                 ‹
//               </button>

//               <p className='font-bold text-gray-900'>
//                 {calendarMonth.toLocaleDateString('default', {
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>

//               <button
//                 type='button'
//                 onClick={handleNextMonth}
//                 className='text-[#07852d] text-2xl'
//               >
//                 ›
//               </button>
//             </div>

//             {/* WEEK DAYS */}

//             <div className='grid grid-cols-7 text-center'>
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                 <p key={day} className='text-[10px] text-gray-500 py-2'>
//                   {day}
//                 </p>
//               ))}
//             </div>

//             {/* CALENDAR */}

//             <div className='grid grid-cols-7'>
//               {Array.from({
//                 length: firstDayOfMonth
//               }).map((_, index) => (
//                 <div key={`empty-${index}`} />
//               ))}

//               {Array.from({
//                 length: daysInMonth
//               }).map((_, index) => {
//                 const day = index + 1

//                 const date = new Date(
//                   calendarMonth.getFullYear(),
//                   calendarMonth.getMonth(),
//                   day
//                 )

//                 const canSelect = isDateInsidePlan(date)

//                 const isSelected =
//                   formatDateForApi(date) === formatDateForApi(selectedDate)

//                 return (
//                   <div key={day} className='flex justify-center py-1'>
//                     <button
//                       type='button'
//                       disabled={!canSelect}
//                       onClick={() => handleSelectDate(date)}
//                       className={`w-9 h-9 rounded-full text-[13px] font-medium ${
//                         isSelected
//                           ? 'bg-[#07852d] text-white'
//                           : canSelect
//                           ? 'text-gray-900 hover:bg-green-50'
//                           : 'text-gray-300'
//                       }`}
//                     >
//                       {day}
//                     </button>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {/* DYNAMIC DATE CARDS */}

//           {/* <div className='flex gap-3 overflow-x-auto px-5 py-5 scrollbar-hide'>
//             {planDates.map(date => {
//               const dateString = formatDateForApi(date)

//               const dayProducts = groupedProducts[dateString] || []

//               const active = dateString === formatDateForApi(selectedDate)

//               const dayTotal = dayProducts.reduce(
//                 (total, item) => total + getItemTotal(item),
//                 0
//               )

//               return (
//                 <button
//                   type='button'
//                   key={dateString}
//                   onClick={() => handleSelectDate(date)}
//                   className={`min-w-[135px] p-3 rounded-xl border text-left ${
//                     active
//                       ? 'border-[#07852d] bg-[#F4FBF4]'
//                       : 'border-gray-200 bg-white'
//                   }`}
//                 >
//                   <div className='flex justify-between items-center'>
//                     <p className='font-bold text-[14px]'>
//                       {date.toLocaleDateString('default', {
//                         day: 'numeric',
//                         month: 'short'
//                       })}
//                     </p>

//                     {active && (
//                       <span className='w-5 h-5 bg-[#07852d] text-white rounded-full flex items-center justify-center text-[10px]'>
//                         ✓
//                       </span>
//                     )}
//                   </div>

//                   <p className='text-[11px] text-gray-500 mt-1'>
//                     {dayProducts.length} Meals • ₹{dayTotal}
//                   </p>
//                 </button>
//               )
//             })}
//           </div> */}

//           {/* PLAN OVERVIEW */}

//           <div className='px-5'>
//             <div className='flex justify-between items-center mb-3'>
//               <h3 className='text-[16px] font-bold'>
//                 Plan Overview ({planDuration} Days)
//               </h3>
//             </div>

//             <div className='space-y-3'>
//               {planDates.map(date => {
//                 const dateString = formatDateForApi(date)

//                 const dayProducts = groupedProducts[dateString] || []

//                 const expanded = expandedDays.includes(dateString)

//                 const dayTotal = dayProducts.reduce(
//                   (total, item) => total + getItemTotal(item),
//                   0
//                 )

//                 return (
//                   <div
//                     key={dateString}
//                     className='border border-gray-200 rounded-xl overflow-hidden relative'
//                   >
//                     <div className='absolute left-0 top-0 bottom-0 w-[3px] bg-[#07852d]' />

//                     <div className='w-full p-4 flex justify-between items-center gap-3'>
//                       <button
//                         type='button'
//                         onClick={() => toggleDate(dateString)}
//                         className='flex-1 flex justify-between items-center text-left'
//                       >
//                         <div>
//                           <p className='text-[13px] font-bold text-[#07852d]'>
//                             {date.toLocaleDateString('default', {
//                               weekday: 'short',
//                               day: 'numeric',
//                               month: 'short'
//                             })}
//                           </p>

//                           <p className='text-[10px] text-gray-500 mt-1'>
//                             {dayProducts.length} Products
//                           </p>
//                         </div>

//                         <div className='flex items-center gap-3'>
//                           <p className='text-[13px] font-bold text-[#07852d]'>
//                             ₹{dayTotal}
//                           </p>

//                           <span>{expanded ? '⌃' : '⌄'}</span>
//                         </div>
//                       </button>

//                       <button
//                         type='button'
//                         // onClick={() => handleOpenProducts(date)}
//                         onClick={() => handleAddProductForDate(dateString)}
//                         className='flex-shrink-0 px-3 h-8 rounded-lg bg-[#065c2d] text-white text-[11px] font-bold'
//                       >
//                         + Add
//                       </button>
//                     </div>

//                     {expanded && (
//                       <div className='px-4 pb-4'>
//                         {dayProducts.length === 0 ? (
//                           <div className='border-t border-gray-100 py-4 text-center'>
//                             <p className='text-[12px] text-gray-400'>
//                               No products added
//                             </p>

//                             {/* <button
//                               type='button'
//                               onClick={() => handleSelectDate(date)}
//                               className='text-[12px] font-bold text-[#07852d] mt-2'
//                             >
//                               Add product to this date
//                             </button> */}
//                             <button
//                               type='button'
//                               onClick={() =>
//                                 handleAddProductForDate(dateString)
//                               }
//                               className='text-[12px] font-bold text-[#065c2d]'
//                             >
//                               + Add Product
//                             </button>
//                           </div>
//                         ) : (
//                           dayProducts.map((item, index) => {
//                             const mappingId = getMappingId(item)

//                             return (
//                               <div
//                                 key={mappingId || index}
//                                 className='border-t border-gray-100 py-3 flex items-center justify-between gap-3'
//                               >
//                                 <div className='flex items-center gap-3 min-w-0'>
//                                   <img
//                                     src={getProductImage(item)}
//                                     alt={getProductName(item)}
//                                     className='w-11 h-11 rounded-full object-cover flex-shrink-0'
//                                     onError={event => {
//                                       event.currentTarget.src = fallbackFood
//                                     }}
//                                   />

//                                   <div className='min-w-0'>
//                                     <p className='text-[13px] font-bold truncate'>
//                                       {getProductName(item)}
//                                     </p>

//                                     <p className='text-[10px] text-gray-500 mt-1'>
//                                       {convertPeriodToTime(item.period) ===
//                                       'Morning'
//                                         ? '🌤️ Morning'
//                                         : '🌙 Evening'}
//                                       {' • '}
//                                       {getItemQuantity(item)}
//                                       {item.product_unit === 'pieces'
//                                         ? ' pcs'
//                                         : 'g'}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <div className='flex items-center gap-3'>
//                                   <p className='text-[13px] font-bold'>
//                                     ₹{getItemTotal(item)}
//                                   </p>

//                                   <button
//                                     type='button'
//                                     disabled={removingId === mappingId}
//                                     onClick={() => handleRemoveProduct(item)}
//                                     className='w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center disabled:opacity-50'
//                                   >
//                                     {removingId === mappingId ? (
//                                       <div className='w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin' />
//                                     ) : (
//                                       '✕'
//                                     )}
//                                   </button>
//                                 </div>
//                               </div>
//                             )
//                           })
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {/* PLAN TOTAL */}

//           {/* <div className='px-5 mt-4'>
//             <div className='border border-gray-200 bg-[#FAFCFA] rounded-xl p-4 flex justify-between items-center'>
//               <div>
//                 <p className='text-[14px] font-bold'>
//                   {planDuration} Days Plan
//                 </p>

//                 <p className='text-[11px] text-gray-500 mt-1'>
//                   {firstPlanDate?.toLocaleDateString('default', {
//                     day: 'numeric',
//                     month: 'short'
//                   })}
//                   {' - '}
//                   {lastPlanDate?.toLocaleDateString('default', {
//                     day: 'numeric',
//                     month: 'short',
//                     year: 'numeric'
//                   })}
//                 </p>
//               </div>

//               <div className='text-right'>
//                 <p className='text-[10px] text-gray-500'>Plan Total</p>

//                 <p className='text-[23px] font-extrabold text-[#07852d]'>
//                   ₹{currentPlanTotal}
//                 </p>
//               </div>
//             </div>
//           </div> */}

//           {/* ONE FIXED TIME */}

//           {/* <div className='px-5 mt-5 mb-2'>
//             <h3 className='text-[15px] font-bold mb-3'>Selected Plan Time</h3>

//             <div className='border border-[#07852d] bg-[#F4FBF4] rounded-xl p-4 flex items-center justify-between'>
//               <div className='flex items-center gap-3'>
//                 <span className='text-xl'>
//                   {displayTime === 'Morning' ? '🌤️' : '🌙'}
//                 </span>

//                 <div>
//                   <p className='text-[14px] font-bold'>{displayTime}</p>

//                   <p className='text-[10px] text-gray-500 mt-1'>
//                     {displayTime === 'Morning' ? '6 AM - 12 PM' : '4 PM - 9 PM'}
//                   </p>
//                 </div>
//               </div>

//               <div className='w-5 h-5 rounded-full border-2 border-[#07852d] flex items-center justify-center'>
//                 <div className='w-2.5 h-2.5 rounded-full bg-[#07852d]' />
//               </div>
//             </div>
//           </div> */}

//           {/* SELECTED QUANTITY */}

//           {/* <div className='px-5 mt-5'>
//             <div className='border border-gray-200 rounded-xl p-4 flex justify-between items-center'>
//               <div>
//                 <p className='text-[11px] text-gray-500'>Selected Quantity</p>

//                 {/* <p className='text-[18px] font-bold mt-1'>
//                   {quantity}
//                   {selectedUnit === 'pieces' ? ' pcs' : 'g'}
//                 </p> */}
//           {/* </div>? */}

//           {/* <p className='text-[18px] font-bold text-[#07852d]'>
//                 ₹{selectedProductTotal}
//               </p> */}
//           {/* </div>
//           </div>  */}
//         </div>

//         {/* FIXED BOTTOM */}

//         <div className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'>
//           <div className='grid grid-cols-3 divide-x divide-gray-100 px-5 pt-3'>
//             <div>
//               <p className='text-[9px] text-gray-500'>Item Price</p>

//               <p className='text-[18px] font-bold'>₹{selectedProductTotal}</p>
//             </div>

//             <div className='pl-3'>
//               <p className='text-[9px] text-gray-500'>Total Items</p>

//               <p className='text-[18px] font-bold'>{planItems.length}</p>
//             </div>

//             <div className='pl-3'>
//               <p className='text-[9px] text-gray-500'>After Adding</p>

//               <p className='text-[18px] font-bold text-[#07852d]'>
//                 ₹{projectedTotal}
//               </p>
//             </div>
//           </div>

//           <div className='px-5 pt-3 pb-5'>
//             {product ? (
//               <button
//                 type='button'
//                 onClick={handleAddToPlan}
//                 disabled={adding || !selectedDate}
//                 className='w-full h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[16px] disabled:opacity-50 flex items-center justify-center'
//               >
//                 {adding
//                   ? 'Adding...'
//                   : `Add to ${formatDateForApi(selectedDate)}`}
//               </button>
//             ) : isPlanComplete ? (
//               <button
//                 type='button'
//                 onClick={handleContinueToCheckout}
//                 className='w-full h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[16px] flex items-center justify-center'
//               >
//                 Continue to Payment • ₹{currentPlanTotal}
//               </button>
//             ) : (
//               <button
//                 type='button'
//                 onClick={() => {
//                   const firstMissingDate = missingDates[0]

//                   if (firstMissingDate) {
//                     handleAddProductForDate(firstMissingDate)
//                   }
//                 }}
//                 className='w-full h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[16px] flex items-center justify-center'
//               >
//                 Add Products • {completedDatesCount}/{planDuration} Days
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }

//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Plans
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import cartService from '../services/cartService'
import fallbackFood from '../assests/food2.jpeg'

const Plans = () => {
  const navigate = useNavigate()
  const location = useLocation()

  /*
   * =========================================================
   * DATA FROM NAVIGATION
   * =========================================================
   */
  const navigationData = location.state || {}
  const incomingProduct = navigationData.product || null
  const incomingPlan = navigationData.plan
    ? {
        ...navigationData.plan,
        plan_id:
          navigationData.plan.plan_id ||
          navigationData.plan.planId ||
          navigationData.plan.id ||
          navigationData.plan._id ||
          navigationData.planId ||
          null,
        id:
          navigationData.plan.id ||
          navigationData.plan.plan_id ||
          navigationData.plan.planId ||
          navigationData.plan._id ||
          navigationData.planId ||
          null
      }
    : navigationData.planId
    ? {
        plan_id: navigationData.planId,
        id: navigationData.planId
      }
    : null
  const incomingQuantity = Number(navigationData.quantity) || 1
  const incomingUnit = navigationData.unit || 'grams'
  const incomingTime = navigationData.time || 'Morning'

  /*
   * =========================================================
   * MAIN DATA
   * =========================================================
   */
  const [selectedPlan, setSelectedPlan] = useState(incomingPlan)
  const [activePlan, setActivePlan] = useState(incomingPlan)
  const [quantity] = useState(incomingQuantity)
  const [selectedUnit] = useState(incomingUnit)
  const [selectedTime, setSelectedTime] = useState(incomingTime)
  const [pendingProduct, setPendingProduct] = useState(incomingProduct)
  const product = pendingProduct

  /*
   * =========================================================
   * CART DATA
   * =========================================================
   */
  const [cartId, setCartId] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [cartPlanId, setCartPlanId] = useState(null)
  const [cartPeriod, setCartPeriod] = useState(null)
  const [cartStartDate, setCartStartDate] = useState(null)

  /*
   * =========================================================
   * UI STATE
   * =========================================================
   */
  const [selectedDate, setSelectedDate] = useState(() => {
    const value = navigationData.selectedDate
    if (!value) return null
    const cleanDate = String(value).slice(0, 10)
    const [year, month, day] = cleanDate.split('-').map(Number)
    if (!year || !month || !day) return null
    const date = new Date(year, month - 1, day)
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [expandedDays, setExpandedDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  /*
   * =========================================================
   * DATE HELPERS
   * =========================================================
   */
  const formatDateForApi = date => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const normalizeApiDate = value => {
    if (!value) return ''
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return formatDateForApi(date)
  }

  const parseApiDate = value => {
    if (!value) return null
    const cleanDate = normalizeApiDate(value)
    const [year, month, day] = cleanDate.split('-').map(Number)
    if (!year || !month || !day) return null
    const date = new Date(year, month - 1, day)
    date.setHours(0, 0, 0, 0)
    return date
  }

  /*
   * =========================================================
   * PRODUCT / PLAN HELPERS
   * =========================================================
   */
  const getProductId = value =>
    value?.product_id || value?.id || value?._id || null
  const getProductName = value =>
    value?.product_name || value?.name || value?.product?.name || 'Meal'
  const getProductImage = value =>
    value?.imageUrl ||
    value?.image_url ||
    value?.product_image ||
    value?.image ||
    value?.product?.imageUrl ||
    fallbackFood
  const getProductPrice = value =>
    Number(
      value?.unit_price ??
        value?.price ??
        value?.selling_price ??
        value?.product_price ??
        value?.product?.price ??
        0
    )
  const getItemQuantity = value => Number(value?.quantity ?? 1)
  const getMappingId = value =>
    value?.mapping_id ||
    value?.mappingId ||
    value?.cart_product_mapping_id ||
    value?.cart_product_id ||
    value?.id ||
    null
  const getPlanId = plan => {
    if (!plan) return null
    return plan.plan_id || plan.planId || plan.id || plan._id || null
  }
  const getPlanName = plan => plan?.plan_name || plan?.name || 'Plan'
  const getPlanDuration = plan => {
    const possibleDuration =
      plan?.duration ??
      plan?.plan_duration ??
      plan?.total_days ??
      plan?.days ??
      plan?.number_of_days
    const numericDuration = Number(possibleDuration)
    if (numericDuration > 0) return numericDuration
    if (String(getPlanName(plan)).toLowerCase().includes('7')) return 7
    return 3
  }

  const convertTimeToPeriod = time =>
    time === 'Morning' ? 'PRE_WORKOUT' : 'POST_WORKOUT'
  const convertPeriodToTime = period => {
    const normalizedPeriod = String(period || '').toUpperCase()
    if (normalizedPeriod === 'PRE_WORKOUT' || normalizedPeriod === 'MORNING')
      return 'Morning'
    return 'Evening'
  }

  const incomingPlanId = getPlanId(incomingPlan)
  const incomingPlanName = getPlanName(incomingPlan)
  const incomingProductId = getProductId(incomingProduct)
  const incomingPlanStartDate = navigationData.planStartDate || null

  /*
   * =========================================================
   * LOAD CART
   * =========================================================
   */
  const loadCart = useCallback(async () => {
    try {
      const response = await cartService.getCart()
      const cart = response?.cart || response?.data?.cart || null

      if (!cart) {
        setCartId(null)
        setCartItems([])
        return null
      }

      const items = Array.isArray(cart.items) ? cart.items : []
      setCartId(cart.cart_id || cart.id || null)
      setCartItems(items)

      const incomingPlanName = getPlanName(incomingPlan)
      const incomingPeriod = convertTimeToPeriod(incomingTime)

      const matchingItem = items.find(item => {
        const itemPlanName = String(item.plan_name || '')
          .trim()
          .toLowerCase()
        const wantedPlanName = String(incomingPlanName || '')
          .trim()
          .toLowerCase()
        return (
          itemPlanName === wantedPlanName &&
          String(item.period || '').toUpperCase() ===
            String(incomingPeriod).toUpperCase()
        )
      })

      const referenceItem = incomingPlan ? matchingItem : items[0] || null
      const resolvedPlanName = incomingPlan
        ? incomingPlanName
        : referenceItem?.plan_name || 'Plan'
      const resolvedPlanId =
        getPlanId(incomingPlan) ||
        (Number(cart.plan_id) > 0 ? Number(cart.plan_id) : null)
      const resolvedDuration = String(resolvedPlanName)
        .toLowerCase()
        .includes('7')
        ? 7
        : 3

      const resolvedPlan = {
        ...(incomingPlan || {}),
        plan_id: resolvedPlanId,
        id: resolvedPlanId,
        plan_name: resolvedPlanName,
        name: resolvedPlanName,
        duration: resolvedDuration
      }

      setActivePlan(previous => {
        if (
          getPlanId(previous) === getPlanId(resolvedPlan) &&
          getPlanName(previous) === getPlanName(resolvedPlan)
        )
          return previous
        return resolvedPlan
      })
      setSelectedPlan(previous => {
        if (
          getPlanId(previous) === getPlanId(resolvedPlan) &&
          getPlanName(previous) === getPlanName(resolvedPlan)
        )
          return previous
        return resolvedPlan
      })

      if (resolvedPlanId) setCartPlanId(resolvedPlanId)

      const resolvedPeriod = incomingProduct
        ? incomingPeriod
        : referenceItem?.period || null
      if (resolvedPeriod) {
        setCartPeriod(resolvedPeriod)
        setSelectedTime(convertPeriodToTime(resolvedPeriod))
      }

      setCartStartDate(previousStartDate => {
        if (previousStartDate) return previousStartDate
        if (navigationData.planStartDate)
          return normalizeApiDate(navigationData.planStartDate)

        const currentPlanItems = items.filter(item => {
          return (
            String(item.plan_name || '')
              .trim()
              .toLowerCase() ===
              String(resolvedPlanName || '')
                .trim()
                .toLowerCase() &&
            String(item.period || '').toUpperCase() ===
              String(resolvedPeriod || '').toUpperCase()
          )
        })

        const dates = currentPlanItems
          .map(item =>
            parseApiDate(item.selected_date || item.date || item.delivery_date)
          )
          .filter(Boolean)
          .sort((first, second) => first.getTime() - second.getTime())

        if (dates.length > 0) return formatDateForApi(dates[0])
        return formatDateForApi(new Date())
      })

      return cart
    } catch (error) {
      console.error('Get cart error:', error)
      return null
    }
  }, [
    incomingPlanId,
    incomingPlanName,
    incomingProductId,
    incomingTime,
    incomingPlanStartDate
  ])

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true)
        await loadCart()
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [loadCart])

  const effectivePlan = activePlan || selectedPlan || incomingPlan
  const effectivePlanId =
    getPlanId(effectivePlan) ||
    getPlanId(incomingPlan) ||
    navigationData.planId ||
    cartPlanId ||
    null
  const planDuration = getPlanDuration(effectivePlan)
  const effectivePeriod = cartPeriod || convertTimeToPeriod(selectedTime)
  const displayTime = convertPeriodToTime(effectivePeriod)

  const [planStartDate, setPlanStartDate] = useState(() => {
    if (cartStartDate) {
      const parsed = parseApiDate(cartStartDate)
      if (parsed) return parsed
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  useEffect(() => {
    if (!cartStartDate) return
    const parsed = parseApiDate(cartStartDate)
    if (parsed) setPlanStartDate(parsed)
  }, [cartStartDate])

  const planDates = useMemo(() => {
    return Array.from({ length: planDuration }, (_, index) => {
      const date = new Date(planStartDate)
      date.setDate(planStartDate.getDate() + index)
      return date
    })
  }, [planDuration, planStartDate])

  const planDateStrings = useMemo(() => {
    return planDates.map(date => formatDateForApi(date))
  }, [planDates])

  useEffect(() => {
    if (planDates.length > 0 && !selectedDate) {
      const firstDate = new Date(planDates[0])
      setSelectedDate(firstDate)
      setExpandedDays([formatDateForApi(firstDate)])
    }
  }, [planDates, selectedDate])

  /*
   * =========================================================
   * CALENDAR LOGIC
   * =========================================================
   */
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())

  useEffect(() => {
    if (selectedDate) {
      setCalendarMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      )
    }
  }, [selectedDate])

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay()

  const isDateInsidePlan = date =>
    planDateStrings.includes(formatDateForApi(date))

  const handleSelectDate = date => {
    const newStart = new Date(date)
    newStart.setHours(0, 0, 0, 0)

    // Shift the plan start date to whatever the user clicked
    setSelectedDate(newStart)
    setPlanStartDate(newStart)

    // Automatically expand the new plan's dates
    setExpandedDays(
      Array.from({ length: planDuration }, (_, index) => {
        const d = new Date(newStart)
        d.setDate(newStart.getDate() + index)
        return formatDateForApi(d)
      })
    )
  }

  const handlePreviousMonth = () => {
    setCalendarMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCalendarMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  /*
   * =========================================================
   * RENDER HELPERS
   * =========================================================
   */
  const planItems = useMemo(() => {
    const activePlanName = String(getPlanName(effectivePlan))
      .trim()
      .toLowerCase()
    const activePeriod = String(effectivePeriod).toUpperCase()

    return cartItems.filter(item => {
      const itemDate = normalizeApiDate(
        item.selected_date || item.date || item.delivery_date
      )
      const itemPlanName = String(item.plan_name || '')
        .trim()
        .toLowerCase()
      const itemPeriod = String(item.period || '').toUpperCase()
      return (
        planDateStrings.includes(itemDate) &&
        itemPlanName === activePlanName &&
        itemPeriod === activePeriod
      )
    })
  }, [cartItems, planDateStrings, effectivePlan, effectivePeriod])

  const groupedProducts = useMemo(() => {
    return planItems.reduce((groups, item) => {
      const itemDate = normalizeApiDate(
        item.selected_date || item.date || item.delivery_date
      )
      if (!itemDate) return groups
      if (!groups[itemDate]) groups[itemDate] = []
      groups[itemDate].push(item)
      return groups
    }, {})
  }, [planItems])

  const getItemTotal = item =>
    item?.total_amount != null
      ? Number(item.total_amount)
      : getProductPrice(item) * getItemQuantity(item)
  const currentPlanTotal = planItems.reduce(
    (total, item) => total + getItemTotal(item),
    0
  )
  const productPrice = getProductPrice(product)
  const selectedProductTotal = productPrice * quantity
  const projectedTotal = currentPlanTotal + selectedProductTotal

  const handleAddToPlan = async () => {
    if (!product) return alert('Product is missing.')
    if (!effectivePlanId) return alert('Plan is missing.')
    if (!selectedDate) return alert('Please select a delivery date.')

    try {
      setAdding(true)
      let currentCartId = cartId

      if (!currentCartId) {
        const cartResponse = await cartService.createCart()
        const createdCart =
          cartResponse?.cart || cartResponse?.data?.cart || cartResponse
        currentCartId = createdCart?.cart_id || createdCart?.id || null
        if (!currentCartId) throw new Error('Cart ID was not returned.')
        setCartId(currentCartId)
      }

      const payload = {
        cart_id: currentCartId,
        product_id: getProductId(product),
        plan_id: effectivePlanId,
        selected_date: formatDateForApi(selectedDate),
        period: effectivePeriod,
        quantity: Number(quantity),
        product_unit: selectedUnit
      }

      await cartService.addToCart(payload)
      await loadCart()
      setPendingProduct(null)

      const dateString = formatDateForApi(selectedDate)
      setExpandedDays(prev =>
        prev.includes(dateString) ? prev : [...prev, dateString]
      )
    } catch (error) {
      console.error('Add product error:', error)
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add product.'
      )
    } finally {
      setAdding(false)
    }
  }

  const handleAddProductForDate = dateString => {
    if (!effectivePlanId) return alert('Plan ID is missing.')
    navigate('/products', {
      state: {
        addToPlanMode: true,
        plan: {
          ...effectivePlan,
          plan_id: effectivePlanId,
          id: effectivePlanId
        },
        planId: effectivePlanId,
        selectedDate: dateString,
        planStartDate: formatDateForApi(planStartDate),
        time: displayTime,
        period: effectivePeriod
      }
    })
  }

  const handleRemoveProduct = async item => {
    const mappingId = getMappingId(item)
    if (!mappingId) return alert('Product mapping ID is missing.')
    try {
      setRemovingId(mappingId)
      await cartService.removeItem(mappingId)
      await loadCart()
    } catch (error) {
      console.error('Remove product error:', error)
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to remove product.'
      )
    } finally {
      setRemovingId(null)
    }
  }

  const toggleDate = dateString => {
    setExpandedDays(prev =>
      prev.includes(dateString)
        ? prev.filter(v => v !== dateString)
        : [...prev, dateString]
    )
  }

  const completedDatesCount = useMemo(
    () =>
      planDateStrings.filter(
        dateString => (groupedProducts[dateString] || []).length > 0
      ).length,
    [planDateStrings, groupedProducts]
  )
  const missingDates = useMemo(
    () =>
      planDateStrings.filter(
        dateString => (groupedProducts[dateString] || []).length === 0
      ),
    [planDateStrings, groupedProducts]
  )
  const isPlanComplete =
    planDateStrings.length > 0 && completedDatesCount === planDateStrings.length

  const handleContinueToCheckout = () => {
    if (!isPlanComplete) {
      alert(`Please add at least one product for ${missingDates[0]}.`)
      return
    }
    navigate('/checkout', {
      state: {
        plan: effectivePlan,
        planId: effectivePlanId,
        planStartDate: formatDateForApi(planStartDate),
        planEndDate: formatDateForApi(planDates[planDates.length - 1]),
        totalDays: planDuration,
        period: effectivePeriod,
        time: displayTime,
        completedDates: completedDatesCount,
        total: currentPlanTotal
      }
    })
  }

  if (loading) {
    return (
      <div className='fixed inset-0 z-[100] bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-9 h-9 border-4 border-gray-200 border-t-[#065c2d] rounded-full animate-spin mx-auto' />
          <p className='mt-3 text-[#065c2d] font-bold'>Loading Plan...</p>
        </div>
      </div>
    )
  }

  // Calculate midnight today for disabling past dates
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className='fixed inset-0 z-[100] bg-black/50 flex justify-center items-end sm:items-center font-sans'>
      <div className='w-full max-w-md h-[96vh] sm:h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden relative shadow-2xl'>
        <div className='w-12 h-1.5 bg-gray-300/80 rounded-full mx-auto mt-3' />

        <div className='px-5 py-4 flex items-center justify-between border-b border-gray-100/60'>
          <div className='flex items-center gap-3 min-w-0'>
            {product && (
              <div className='w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0'>
                <img
                  src={getProductImage(product)}
                  alt={getProductName(product)}
                  className='w-full h-full object-cover'
                  onError={e => (e.currentTarget.src = fallbackFood)}
                />
              </div>
            )}
            <div className='min-w-0'>
              <h2 className='text-[18px] font-black text-gray-900 truncate tracking-tight'>
                {product
                  ? `Add ${getProductName(product)}`
                  : `${getPlanName(effectivePlan)} Details`}
              </h2>
              {product && (
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-[12px] font-bold text-[#065c2d]'>
                    ₹{product.price}
                  </span>
                  <span className='text-[11px] font-medium text-gray-400'>
                    • {product.calories} kcal
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 hover:bg-gray-200'
          >
            ✕
          </button>
        </div>

        <div className='h-[calc(100%-180px)] overflow-y-auto pb-28 scrollbar-hide'>
          {/* CALENDAR SECTION */}
          <div className='px-5 mt-4 mb-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-[15px] font-bold text-gray-900'>
                Select Plan Start Date
              </h3>
            </div>

            <div className='flex items-center justify-between mt-3 mb-2 px-1'>
              <button
                type='button'
                onClick={handlePreviousMonth}
                className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#065c2d]'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <p className='font-bold text-[14px] text-gray-800 tracking-wide'>
                {calendarMonth.toLocaleDateString('default', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <button
                type='button'
                onClick={handleNextMonth}
                className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#065c2d]'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-7 text-center mb-1'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <p
                  key={day}
                  className='text-[10px] uppercase tracking-widest font-bold text-gray-400 py-1'
                >
                  {day}
                </p>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-y-1.5'>
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const date = new Date(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth(),
                  day
                )

                // Allow selecting any date from today onwards
                const isPast = date.getTime() < today.getTime()
                const canSelect = !isPast

                const isSelected =
                  formatDateForApi(date) === formatDateForApi(selectedDate)
                const isInPlan = isDateInsidePlan(date)

                return (
                  <div key={day} className='flex justify-center'>
                    <button
                      type='button'
                      disabled={!canSelect}
                      onClick={() => handleSelectDate(date)}
                      className={`w-9 h-9 rounded-full text-[13px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[#065c2d] text-white shadow-md' // Solid green for chosen start date
                          : isInPlan
                          ? 'bg-[#EEF8F1] text-[#065c2d]' // Light green for the rest of the plan window
                          : canSelect
                          ? 'text-gray-800 hover:bg-gray-100' // Standard future date
                          : 'text-gray-300' // Past date disabled
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* PLAN OVERVIEW */}
          <div className='px-5'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-[15px] font-bold text-gray-900'>
                Plan Overview{' '}
                <span className='text-gray-400 font-medium ml-1'>
                  ({planDuration} Days)
                </span>
              </h3>
            </div>

            <div className='space-y-3'>
              {planDates.map(date => {
                const dateString = formatDateForApi(date)
                const dayProducts = groupedProducts[dateString] || []
                const expanded = expandedDays.includes(dateString)
                const dayTotal = dayProducts.reduce(
                  (total, item) => total + getItemTotal(item),
                  0
                )

                return (
                  <div
                    key={dateString}
                    className='bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden relative transition-all'
                  >
                    <div className='absolute left-0 top-0 bottom-0 w-[4px] bg-[#065c2d]' />

                    <div className='w-full p-4 flex justify-between items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => toggleDate(dateString)}
                        className='flex-1 flex justify-between items-center text-left'
                      >
                        <div>
                          <p className='text-[13px] font-black text-gray-900'>
                            {date.toLocaleDateString('default', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <p className='text-[11px] font-medium text-gray-500 mt-0.5'>
                            {dayProducts.length}{' '}
                            {dayProducts.length === 1 ? 'Product' : 'Products'}
                          </p>
                        </div>
                        <div className='flex items-center gap-3 pr-2'>
                          <p className='text-[13px] font-bold text-[#065c2d]'>
                            ₹{dayTotal}
                          </p>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expanded ? 'rotate-180' : ''
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        </div>
                      </button>

                      <button
                        type='button'
                        onClick={() => handleAddProductForDate(dateString)}
                        className='flex-shrink-0 px-3.5 h-8 rounded-xl bg-[#EEF8F1] text-[#065c2d] text-[11px] font-bold hover:bg-[#E3F2E6] transition-colors'
                      >
                        + Add
                      </button>
                    </div>

                    {expanded && (
                      <div className='px-4 pb-4 bg-gray-50/50'>
                        {dayProducts.length === 0 ? (
                          <div className='pt-4 pb-1 text-center'>
                            <p className='text-[12px] font-medium text-gray-400'>
                              No products added yet.
                            </p>
                          </div>
                        ) : (
                          <div className='space-y-3 pt-3'>
                            {dayProducts.map((item, index) => {
                              const mappingId = getMappingId(item)
                              return (
                                <div
                                  key={mappingId || index}
                                  className='flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm'
                                >
                                  <div className='flex items-center gap-3 min-w-0'>
                                    <img
                                      src={getProductImage(item)}
                                      alt={getProductName(item)}
                                      className='w-10 h-10 rounded-full object-cover flex-shrink-0'
                                      onError={e =>
                                        (e.currentTarget.src = fallbackFood)
                                      }
                                    />
                                    <div className='min-w-0'>
                                      <p className='text-[12px] font-bold text-gray-900 truncate'>
                                        {getProductName(item)}
                                      </p>
                                      <p className='text-[10px] font-medium text-gray-500 mt-0.5'>
                                        {getItemQuantity(item)}{' '}
                                        {item.product_unit === 'pieces'
                                          ? 'pcs'
                                          : 'g'}{' '}
                                        • {convertPeriodToTime(item.period)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-3'>
                                    <p className='text-[12px] font-bold text-gray-900'>
                                      ₹{getItemTotal(item)}
                                    </p>
                                    <button
                                      type='button'
                                      disabled={removingId === mappingId}
                                      onClick={() => handleRemoveProduct(item)}
                                      className='w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50'
                                    >
                                      {removingId === mappingId ? (
                                        <div className='w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin' />
                                      ) : (
                                        '✕'
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM ACTION */}
        <div className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]'>
          <div className='flex items-center justify-between px-6 pt-4 pb-2'>
            <div>
              <p className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                Total Items
              </p>
              <p className='text-[16px] font-black text-gray-900'>
                {planItems.length}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                Plan Total
              </p>
              <p className='text-[18px] font-black text-[#065c2d]'>
                ₹{projectedTotal}
              </p>
            </div>
          </div>

          <div className='px-5 pb-5 pt-2'>
            {product ? (
              <button
                type='button'
                onClick={handleAddToPlan}
                disabled={adding || !selectedDate}
                className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[14px] disabled:opacity-50 flex items-center justify-center shadow-md active:scale-[0.98] transition-transform'
              >
                {adding
                  ? 'Adding...'
                  : `Add to ${
                      selectedDate ? formatDateForApi(selectedDate) : 'Plan'
                    }`}
              </button>
            ) : isPlanComplete ? (
              <button
                type='button'
                onClick={handleContinueToCheckout}
                className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[14px] flex items-center justify-center shadow-md active:scale-[0.98] transition-transform'
              >
                Continue to Checkout
              </button>
            ) : (
              <button
                type='button'
                onClick={() =>
                  missingDates[0] && handleAddProductForDate(missingDates[0])
                }
                className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[14px] flex items-center justify-center shadow-md active:scale-[0.98] transition-transform'
              >
                Add Products • {completedDatesCount}/{planDuration} Days
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default Plans
