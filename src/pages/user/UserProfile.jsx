import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useUser from '../../hooks/useUser'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import img from '../../assets/home/girl.png'

const UserProfile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentUser, isLoading } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    about: ''
  })

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name || user?.displayName || '',
        email: currentUser?.email || user?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || '',
        gender: currentUser?.gender || '',
        about: currentUser?.about || ''
      })
    }
  }, [currentUser, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 py-40'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}

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
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50'></div>
                  <img
                    src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'User') + '&background=random'}
                    alt={formData.name}
                    className='relative h-40 w-40 rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-lg'
                  />
                </div>
              </div>

              <div className='flex-1 pt-4'>
                {isEditing ? (
                  <div className='space-y-4 flex-1'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Full Name</label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>About</label>
                      <textarea
                        name='about'
                        value={formData.about}
                        onChange={handleInputChange}
                        rows='3'
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                      {formData.name}
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400 capitalize mb-4'>
                      {currentUser?.role || 'Member'}
                    </p>
                    <p className='text-gray-600 dark:text-gray-400 mb-6'>
                      {formData.about || 'No bio added yet'}
                    </p>
                  </>
                )}

                {/* Action Buttons */}
                <div className='flex gap-4'>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors'
                      >
                        <FaSave />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className='flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors'
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className='flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors'
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200 dark:border-gray-700 my-8'></div>

            {/* Details Section */}
            <div className='grid md:grid-cols-2 gap-8 mb-8'>
              {/* Contact Information */}
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Contact Information</h3>
                <div className='space-y-4'>
                  {isEditing ? (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Email</label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled
                          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Phone</label>
                        <input
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder='Enter phone number'
                          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Address</label>
                        <input
                          type='text'
                          name='address'
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder='Enter address'
                          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                        <FaEnvelope className='text-primary w-5 h-5 flex-shrink-0' />
                        <div>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>Email</p>
                          <a href={`mailto:${formData.email}`} className='hover:text-primary transition-colors'>
                            {formData.email}
                          </a>
                        </div>
                      </div>
                      {formData.phone && (
                        <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                          <FaPhone className='text-primary w-5 h-5 flex-shrink-0' />
                          <div>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Phone</p>
                            <a href={`tel:${formData.phone}`} className='hover:text-primary transition-colors'>
                              {formData.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {formData.address && (
                        <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                          <FaMapMarkerAlt className='text-primary w-5 h-5 flex-shrink-0' />
                          <div>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Address</p>
                            <span>{formData.address}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Personal Information</h3>
                <div className='space-y-4'>
                  {isEditing ? (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Gender</label>
                      <select
                        name='gender'
                        value={formData.gender}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
                      >
                        <option value=''>Select gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>Gender:</span>
                        <span className='font-medium text-gray-900 dark:text-white capitalize'>
                          {formData.gender || 'Not specified'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>Role:</span>
                        <span className='font-medium text-gray-900 dark:text-white capitalize'>
                          {currentUser?.role || 'Member'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>Status:</span>
                        <span className='inline-flex items-center gap-2 font-medium'>
                          <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                          <span className='text-green-600 dark:text-green-400'>Active</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            {!isEditing && (
              <>
                <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Account Statistics</h3>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center'>
                      <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                        {currentUser?.enrolledClasses?.length || 0}
                      </p>
                      <p className='text-gray-600 dark:text-gray-400 text-sm mt-2'>Enrolled Classes</p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center'>
                      <p className='text-3xl font-bold text-green-600 dark:text-green-400'>0</p>
                      <p className='text-gray-600 dark:text-gray-400 text-sm mt-2'>Completed</p>
                    </div>
                    <div className='bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center'>
                      <p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>0</p>
                      <p className='text-gray-600 dark:text-gray-400 text-sm mt-2'>Cart Items</p>
                    </div>
                    <div className='bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center'>
                      <p className='text-3xl font-bold text-orange-600 dark:text-orange-400'>$0</p>
                      <p className='text-gray-600 dark:text-gray-400 text-sm mt-2'>Total Spent</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile