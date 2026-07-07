import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export default function OtpModal ({ show, onClose, mobile }) {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const OTP_LENGTH = 6

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputsRef = useRef([])

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  // const verifyOtp = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const response = await fetch("http://localhost:3001/api/auth/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include", // ✅ REQUIRED
  //       body: JSON.stringify({
  //         mobile,
  //         otp: otp.join("")
  //       })
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Invalid OTP");
  //     }

  //     // ❌ DO NOT store JWT (HTTP-only cookie is used)
  //     // localStorage.setItem("user", JSON.stringify(data.user)); ❌

  //     // ✅ IMPORTANT: Sync auth state from backend
  //     const user = await checkAuth();

  //     if (user) {
  //       navigate("/home", { replace: true });
  //     } else {
  //       navigate("/", { replace: true });
  //     }

  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const verifyOtp = async () => {
    try {
      setLoading(true)

      setError('')

      await authService.verifyOtp(mobile, otp.join(''))

      const user = await checkAuth()

      if (user) {
        navigate('/home', {
          replace: true
        })
      } else {
        navigate('/', {
          replace: true
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div
      className={`fixed left-1/2 bottom-0 transform -translate-x-1/2 w-full bg-white rounded-t-3xl shadow-2xl p-6 z-50 transition-transform duration-500 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Enter the OTP</h2>
        <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
          ✕
        </button>
      </div>

      <div className='flex justify-between mb-4'>
        {otp.map((value, index) => (
          <input
            key={index}
            ref={el => (inputsRef.current[index] = el)}
            type='text'
            maxLength='1'
            value={value}
            onChange={e => handleChange(e.target.value, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            className='w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7043]'
          />
        ))}
      </div>

      {error && (
        <p className='text-red-500 text-sm text-center mb-3'>{error}</p>
      )}

      <button
        onClick={verifyOtp}
        disabled={otp.join('').length !== OTP_LENGTH || loading}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-lg ${
          otp.join('').length === OTP_LENGTH && !loading
            ? 'bg-gradient-to-r from-[#FF7043] to-[#FF3D00]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <p className='text-center text-sm text-gray-500 mt-4'>
        Didn’t receive the code?{' '}
        <button className='text-[#FF7043] font-medium hover:underline'>
          Resend OTP
        </button>
      </p>
    </div>
  )
}
