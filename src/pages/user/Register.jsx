import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import GoogleLogin from "../../components/Social/GoogleLogin"
import { FaUser, FaEnvelope, FaLock, FaPhone, FaVenusMars, FaImage, FaMapMarkerAlt } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const { signup } = useAuth()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Step 1: Create Firebase auth account
      await signup(data.email, data.password)
      toast.success('Firebase account created!')

      // Step 2: Handle file upload - convert to base64 or use a placeholder URL
      let photoUrl = ''
      if (data.photoUrl && data.photoUrl.length > 0) {
        const file = data.photoUrl[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        
        // Wait for file reading
        await new Promise((resolve) => {
          reader.onload = () => {
            photoUrl = reader.result
            resolve()
          }
        })
      }

      // Step 3: Prepare user data for MongoDB
      const userData = {
        name: data.username,
        email: data.email,
        phone: data.contactNumber,
        gender: data.gender,
        photoUrl: photoUrl || 'https://via.placeholder.com/150',
        address: data.address,
        role: 'user',
        createdAt: new Date(),
      }

      // Step 4: Send to backend to save in MongoDB
      const response = await fetch('https://yoga-master-1.onrender.com/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setErrorMessage(result.message || 'Failed to save profile. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already registered. Please login instead.')
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use a stronger password.')
      } else {
        setErrorMessage(error.message || 'An error occurred during registration. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 py-10'>
      <div className='w-[400px] p-8 shadow-lg rounded-lg bg-white'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Register</h2>

        {/* Success Message */}
        {successMessage && (
          <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className='mb-4'>
            <label htmlFor='username' className='block text-gray-700 font-bold mb-2'>
              <FaUser className='inline-block mr-2 text-blue-500' />
              Username
            </label>
            <input
              type='text'
              id='username'
              placeholder='Enter your username'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' }
              })}
            />
            {errors.username && <span className='text-red-500 text-sm'>{errors.username.message}</span>}
          </div>

          {/* Email Field */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
              <FaEnvelope className='inline-block mr-2 text-blue-500' />
              Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('email', { 
                required: 'Email is required',
                // pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
              })}
            />
            {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-bold mb-2'>
              <FaLock className='inline-block mr-2 text-blue-500' />
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='Enter your password'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
            {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className='mb-6'>
            <label htmlFor='confirmPassword' className='block text-gray-700 font-bold mb-2'>
              <FaLock className='inline-block mr-2 text-blue-500' />
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='Confirm your password'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && <span className='text-red-500 text-sm'>{errors.confirmPassword.message}</span>}
          </div>

          {/* Contact Number Field */}
          <div className='mb-4'>
            <label htmlFor='contactNumber' className='block text-gray-700 font-bold mb-2'>
              <FaPhone className='inline-block mr-2 text-blue-500' />
              Contact Number
            </label>
            <input
              type='tel'
              id='contactNumber'
              placeholder='Enter your phone number'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('contactNumber', { 
                required: 'Contact number is required',
                pattern: { value: /^[0-9]{10,}$/, message: 'Please enter a valid phone number' }
              })}
            />
            {errors.contactNumber && <span className='text-red-500 text-sm'>{errors.contactNumber.message}</span>}
          </div>

          {/* Gender Field */}
          <div className='mb-4'>
            <label htmlFor='gender' className='block text-gray-700 font-bold mb-2'>
              <FaVenusMars className='inline-block mr-2 text-blue-500' />
              Gender
            </label>
            <select
              id='gender'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('gender', { required: 'Please select a gender' })}
            >
              <option value=''>Select Gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
            {errors.gender && <span className='text-red-500 text-sm'>{errors.gender.message}</span>}
          </div>

          {/* Profile Image Field */}
          <div className='mb-4'>
            <label htmlFor='profileImage' className='block text-gray-700 font-bold mb-2'>
              <FaImage className='inline-block mr-2 text-blue-500' />
              photoUrl
            </label>
            <input
              type='file'
              id='photoUrl'
              accept='image/*'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('photoUrl', { required: 'Profile image is required' })}
            />
            {errors.photoUrl && <span className='text-red-500 text-sm'>{errors.photoUrl.message}</span>}
          </div>

          {/* Address Field */}
          <div className='mb-6'>
            <label htmlFor='address' className='block text-gray-700 font-bold mb-2'>
              <FaMapMarkerAlt className='inline-block mr-2 text-blue-500' />
              Address
            </label>
            <textarea
              id='address'
              placeholder='Enter your full address'
              rows='3'
              className='text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              {...register('address', { 
                required: 'Address is required',
                minLength: { value: 10, message: 'Address must be at least 10 characters' }
              })}
            />
            {errors.address && <span className='text-red-500 text-sm'>{errors.address.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded-lg transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className='text-center text-gray-600 mt-4'>
          Already have an account? <a href='/login' className='text-blue-500 font-bold hover:underline'>Login</a>
        </p>
        <GoogleLogin/>
      </div>
    </div>
  )
}

export default Register
