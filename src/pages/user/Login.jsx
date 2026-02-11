import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { FaGoogle } from 'react-icons/fa'
import { IoEyeOutline } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, googleLogin, error, setError, loader, setLoader } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setError('')
    e.preventDefault()

    // Validate inputs
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoader(true)
      const result = await login(email, password)
      
      // Wait a bit for onAuthStateChanged to fire and set user/token
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Logged in successfully!')
      navigate(location.state?.from || '/')
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err?.code?.includes('user-not-found')
        ? 'User not found'
        : err?.code?.includes('wrong-password')
        ? 'Wrong password'
        : err?.message || 'Login failed'
      toast.error(errorMsg)
      setError(err.code)
    } finally {
      setLoader(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoader(true)
      const result = await googleLogin()
      if (result?.user?.email) {
        const userImp = {
          name: result.user?.displayName,
          email: result.user?.email,
          photoUrl: result.user?.photoURL,
          role: 'user',
          gender: 'Not specified',
          address: 'Not specified',
          phone: 'Not specified',
          about: 'Not specified',
          skills: 'Not specified',
          enrolledClasses: [],
        };

        if(result.user?.email && result.user?.displayName){
          return axios.post('https://yoga-master-1.onrender.com/new-user', userImp).then(() => {
            toast.success('Logged in with Google successfully!')
            navigate('/')
          }).catch((error) => {
            console.error('Error adding new user:', error)
            toast.error('Failed to add new user. Please try again.')
          })
        }
      }
    } catch (err) {
      console.error('Google login error:', err?.code, err?.message, err)
      
      if (err?.code === 'auth/cancelled-popup-request') {
        toast.info('Google sign-in was cancelled.')
      } else if (err?.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Please allow popups and try again.')
      } else if (err?.code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled. Contact support.')
      } else if (err?.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.')
      } else {
        toast.error(err?.message || 'Google login failed. Please try again.')
      }
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 text-black dark:text-white bg-gray-50 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3 text-black dark:text-white bg-gray-50 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              title={showPassword ? "Hide password" : "Show password"}
            >
              <IoEyeOutline className='w-5 h-5'/>
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="#"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loader ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-red-500" />
          {loader ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login