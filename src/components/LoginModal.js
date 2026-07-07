import React, { useState } from 'react'
import authService from '../services/authService'

export default function LoginModal ({ show, onClose, onContinue }) {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // const handleLogin = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const response = await fetch("http://localhost:3001/api/auth/send-otp", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ mobile })
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to send OTP");
  //     }

  //     // ✅ NO JWT HERE
  //     onContinue(mobile);

  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    try {
      setLoading(true)

      setError('')

      await authService.sendOtp(mobile)

      onContinue(mobile)
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
        <h2 className='text-2xl font-bold text-gray-900'>
          Enter your mobile number
        </h2>
        <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
          ✕
        </button>
      </div>

      <div className='flex items-center border border-gray-300 rounded-xl p-3 bg-gray-50 shadow-inner mb-2'>
        <div className='flex items-center pr-3 border-r border-gray-200 text-gray-700'>
          <span className='mr-1'>🇮🇳</span>
          <span className='font-medium'>+91</span>
        </div>
        <input
          type='tel'
          maxLength='10'
          placeholder='Enter mobile number'
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
          className='flex-1 ml-3 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent'
        />
      </div>

      {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

      <button
        disabled={mobile.length !== 10 || loading}
        onClick={handleLogin}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-lg ${
          mobile.length === 10 && !loading
            ? 'bg-gradient-to-r from-[#FF7043] to-[#FF3D00]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Sending OTP...' : 'Continue'}
      </button>
    </div>
  )
}
