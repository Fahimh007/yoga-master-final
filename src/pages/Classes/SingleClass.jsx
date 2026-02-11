import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import useAuth from '../../hooks/useAuth'
import useUser from '../../hooks/useUser'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaMapPin, FaVideo, FaUsers, FaChair, FaDollarSign, FaClock, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'

const SingleClass = () => {
  const { id } = useParams()
  const api = useAxiosFetch()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentUser } = useUser()
  const [cls, setCls] = useState(null)
  const [loading, setLoader] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    api.get(`/class/${id}`)
      .then(res => { if (mounted) setCls(res.data) })
      .catch(() => { if (mounted) setCls(null) })
      .finally(() => { if (mounted) setLoader(false) })

    return () => { mounted = false }
  }, [api, id])

  // Check if user has enrolled in this class
  useEffect(() => {
    if (!user?.email || !id || !currentUser) {
      setIsEnrolled(false)
      return
    }

    // Check if classId is in user's enrolledClasses array
    const enrolledClassIds = currentUser?.enrolledClasses || []
    const isEnrolledInClass = enrolledClassIds.includes(id)
    setIsEnrolled(isEnrolledInClass)
    
    console.log('Checking enrollment - User enrolledClasses:', enrolledClassIds, 'Current class:', id, 'Is Enrolled:', isEnrolledInClass)
  }, [user?.email, id, currentUser])

  const handleEnroll = async () => {
    if (!user?.email) {
      toast.error('Please login to enroll in a class')
      navigate('/login')
      return
    }

    if (!currentUser) {
      toast.error('Please wait, loading your profile...')
      return
    }

    const role = currentUser?.role
    if (role === 'admin' || role === 'instructor') {
      toast.error('Admins and instructors cannot enroll in classes.')
      return
    }

    const availableSeats = (cls.availableSeats || 0) - (cls.totalEnrolled || 0)
    if (availableSeats <= 0) {
      toast.error('No seats available for this class.')
      return
    }

    if (isEnrolled) {
      toast.info('You have already enrolled in this class.')
      return
    }

    setEnrolling(true)
    try {
      const payload = {
        classId: id,
        name: cls.name,
        price: cls.price,
        userMail: user.email,
        instructorEmail: cls.instructorEmail,
        image: cls.image
      }

      const res = await axiosSecure.post('/add-to-cart', payload)
      
      if (res?.data?.insertedId || res.status === 200 || res.status === 201) {
        toast.success('Class enrolled successfully! Proceed to cart to checkout.')
        setIsEnrolled(true)
      } else {
        toast.error('Could not enroll in class.')
      }
    } catch (err) {
      console.error('Enrollment error:', err)
      if (err?.response?.status === 401) {
        toast.error('Unauthorized. Please login again.')
        navigate('/login')
      } else {
        toast.error('Failed to enroll in class. Please try again.')
      }
    } finally {
      setEnrolling(false)
    }
  }

  const handleCancelEnrollment = async () => {
    if (!user?.email || !id) {
      toast.error('Unable to cancel enrollment')
      return
    }

    setEnrolling(true)
    try {
      // First, find the cart item ID for this user and class
      const cartRes = await axiosSecure.get(`/cart-item/${id}`, { params: { email: user.email } })
      
      if (!cartRes?.data?._id) {
        toast.error('Could not find enrollment to cancel')
        return
      }

      // Delete the cart item
      const deleteRes = await axiosSecure.delete(`/delete-cart-item/${cartRes.data._id}`)
      
      if (deleteRes.status === 200 || deleteRes.status === 204) {
        toast.success('Enrollment cancelled successfully.')
        setIsEnrolled(false)
      } else {
        toast.error('Could not cancel enrollment.')
      }
    } catch (err) {
      console.error('Cancel enrollment error:', err)
      if (err?.response?.status === 401) {
        toast.error('Unauthorized. Please login again.')
        navigate('/login')
      } else {
        toast.error('Failed to cancel enrollment. Please try again.')
      }
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading class details...</p>
        </div>
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaMapPin className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Class not found</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">The class you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const availableSeats = (cls.availableSeats || 0) - (cls.totalEnrolled || 0)
  const seatsPercentage = cls.availableSeats ? ((cls.totalEnrolled || 0) / cls.availableSeats) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-40 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-xl shadow-xl bg-gray-200 dark:bg-gray-700 h-96 lg:h-auto">
              <img
                src={cls.image || 'https://via.placeholder.com/600x400'}
                alt={cls.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {isEnrolled && cls.status === 'approved' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                  <FaCheckCircle /> Approved
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{cls.name}</h2>
            
            <div className="space-y-4 mb-6">
              {/* Price */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaDollarSign className="text-primary" /> Price
                </span>
                <span className="text-2xl font-bold text-primary">${cls.price || 'N/A'}</span>
              </div>

              {/* Available Seats */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaChair className="text-primary" /> Available Seats
                </span>
                <span className={`text-lg font-semibold ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {availableSeats}/{cls.availableSeats || 0}
                </span>
              </div>

              {/* Enrolled */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaUsers className="text-primary" /> Enrolled
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{cls.totalEnrolled || 0}</span>
              </div>

              {/* Seats Progress Bar */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Enrollment Progress</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
                    style={{ width: `${Math.min(seatsPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(seatsPercentage)}% full</p>
              </div>
            </div>

            {/* Enroll Button */}
            {!user?.email ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Login to Enroll
              </button>
            ) : isEnrolled ? (
              // Show both Enrolled and Cancel buttons when enrolled
              <div className="flex gap-3">
                <button
                  disabled={true}
                  className="flex-1 bg-green-500 text-white font-semibold py-3 px-4 rounded-lg cursor-default"
                  title="Already enrolled in this class"
                >
                  Enrolled
                </button>
                <button
                  onClick={handleCancelEnrollment}
                  disabled={enrolling}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  title="Cancel your enrollment"
                >
                  {enrolling ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            ) : (
              // Show Enroll Now button when not enrolled
              <button
                onClick={handleEnroll}
                disabled={availableSeats <= 0 || enrolling}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  availableSeats <= 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
                title={
                  availableSeats <= 0
                    ? 'No seats available'
                    : 'Click to enroll in this class'
                }
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Class</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {cls.description || 'No description available'}
          </p>
        </div>

        {/* Instructor & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Instructor Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaUser className="text-primary" /> Instructor Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Name</label>
                <p className="text-lg text-gray-900 dark:text-white mt-1">{cls.instructorName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaEnvelope className="text-primary" /> Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white mt-1 break-all hover:text-primary transition-colors">
                  <a href={`mailto:${cls.instructorEmail}`}>{cls.instructorEmail || 'N/A'}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Class Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaClock className="text-primary" /> Class Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                <p className="text-lg mt-1">
                  <span className={`px-3 py-1 rounded-full font-semibold ${
                    cls.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    cls.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cls.status?.charAt(0).toUpperCase() + cls.status?.slice(1) || 'N/A'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> Submitted Date
                </label>
                <p className="text-lg text-gray-900 dark:text-white mt-1">
                  {cls.submitted ? new Date(cls.submitted).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {cls.videoLink && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaVideo className="text-primary" /> Class Preview Video
            </h3>
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${cls.videoLink.split('v=')[1] || cls.videoLink}`}
                title={cls.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6 text-center">
            <FaUsers className="text-3xl text-blue-600 dark:text-blue-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Capacity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{cls.availableSeats || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6 text-center">
            <FaCheckCircle className="text-3xl text-green-600 dark:text-green-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Already Enrolled</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{cls.totalEnrolled || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-6 text-center">
            <FaDollarSign className="text-3xl text-purple-600 dark:text-purple-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Price per Class</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${cls.price || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleClass