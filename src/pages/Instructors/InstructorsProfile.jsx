import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import img from '../../assets/home/girl.png'

const InstructorsProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const api = useAxiosFetch()
  const [instructor, setInstructor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await api.get(`/users/${id}`)
        setInstructor(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInstructor()
  }, [id, api])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Loading instructor profile...</p>
        </div>
      </div>
    )
  }

  if (error || !instructor) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-md w-full mx-auto px-4'>
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
            <svg className='w-12 h-12 text-red-500 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
            </svg>
            <p className='text-center text-red-600 dark:text-red-400 font-semibold mb-2'>Error loading profile</p>
            <p className='text-center text-red-500 dark:text-red-300 text-sm mb-4'>{error || 'Instructor not found'}</p>
            <button
              onClick={() => navigate('/instructors')}
              className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
            >
              Back to Instructors
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 py-40'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/instructors')}
          className='flex items-center gap-2 text-white hover:text-primary/80 font-semibold mb-8 transition-colors'
        >
          <FaArrowLeft />
          Back to Instructors
        </button>

        {/* Profile Card */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden'>
          {/* Header Background */}
          <div className='h-32 bg-gradient-to-r from-blue-600 to-purple-600'></div>

          {/* Profile Content */}
          <div className='px-6 md:px-12 pb-8'>
            {/* Profile Image & Name */}
            <div className='flex flex-col md:flex-row gap-8 items-start -mt-16 mb-8'>
              <div className='flex-shrink-0'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50'></div>
                  <img
                    src={instructor?.photoUrl || img}
                    alt={instructor?.name}
                    onError={(e) => { e.target.src = img }}
                    className='relative h-40 w-40 rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-lg'
                  />
                </div>
              </div>

              <div className='flex-1 pt-4'>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                  {instructor?.name}
                </h1>
                <p className='text-lg text-primary font-semibold mb-4 capitalize'>
                  {instructor?.role || 'Yoga Instructor'}
                </p>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>
                  {instructor?.about || 'Expert yoga instructor dedicated to helping students achieve their fitness goals.'}
                </p>

                {/* Contact Details */}
                <div className='space-y-3'>
                  {instructor?.email && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                      <FaEnvelope className='text-primary w-5 h-5 flex-shrink-0' />
                      <a href={`mailto:${instructor.email}`} className='hover:text-primary transition-colors'>
                        {instructor.email}
                      </a>
                    </div>
                  )}
                  {instructor?.phone && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                      <FaPhone className='text-primary w-5 h-5 flex-shrink-0' />
                      <a href={`tel:${instructor.phone}`} className='hover:text-primary transition-colors'>
                        {instructor.phone}
                      </a>
                    </div>
                  )}
                  {instructor?.address && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                      <FaMapMarkerAlt className='text-primary w-5 h-5 flex-shrink-0' />
                      <span>{instructor.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200 dark:border-gray-700 my-8'></div>

            {/* Details Section */}
            <div className='grid md:grid-cols-2 gap-8 mb-8'>
              {/* Skills */}
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Specializations</h3>
                {instructor?.skills ? (
                  <div className='flex flex-wrap gap-2'>
                    {(Array.isArray(instructor.skills) ? instructor.skills : [instructor.skills]).map((skill, i) => (
                      <span
                        key={i}
                        className='bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 dark:text-gray-400'>No specializations listed</p>
                )}
              </div>

              {/* Additional Info */}
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Additional Info</h3>
                <ul className='space-y-2 text-gray-700 dark:text-gray-300'>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Gender:</span>
                    <span className='capitalize'>{instructor?.gender || 'Not specified'}</span>
                  </li>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Role:</span>
                    <span className='capitalize'>{instructor?.role || 'User'}</span>
                  </li>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Status:</span>
                    <span className='inline-flex items-center gap-2'>
                      <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                      Active
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Media */}
            <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Connect</h3>
              <div className='flex gap-4'>
                <a
                  href='#'
                  className='w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors'
                  title='Facebook'
                >
                  <FaFacebook />
                </a>
                <a
                  href='#'
                  className='w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors'
                  title='Twitter'
                >
                  <FaTwitter />
                </a>
                <a
                  href='#'
                  className='w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors'
                  title='Instagram'
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Enroll Button */}
            <div className='mt-8 flex gap-4'>
              <button className='flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg'>
                Enroll in Classes
              </button>
              <button
                onClick={() => navigate('/instructors')}
                className='flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg'
              >
                View Other Instructors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorsProfile
