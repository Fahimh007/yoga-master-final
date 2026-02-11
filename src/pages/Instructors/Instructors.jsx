import React from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../../assets/home/girl.png'

const Instructors = () => {
  const api = useAxiosFetch();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchInstructors = async () => {
        try {
          const response = await api.get('/instructors');
          setInstructors(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoader(false);
        }
      };
      fetchInstructors();
  }, []);

  return (
    <div className='min-h-screen dark:from-gray-900 dark:to-gray-800 py-40 px-4'>
      <div className='md:w-[90%] lg:w-[80%] mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4'>
            Our Amazing Instructors
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg'>
            Meet our talented team of expert instructors dedicated to helping you achieve your goals
          </p>
        </div>
  
        {/* Content Section */}
        {loading ? (
          <div className='flex flex-col items-center justify-center min-h-[400px]'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary'></div>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading instructors...</p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center min-h-[400px]'>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md'>
              <svg className='w-12 h-12 text-red-500 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
              </svg>
              <p className='text-center text-red-600 dark:text-red-400 font-semibold'>Error loading instructors</p>
              <p className='text-center text-red-500 dark:text-red-300 text-sm mt-2'>{error}</p>
            </div>
          </div>
        ) : instructors.length === 0 ? (
          <div className='flex flex-col items-center justify-center min-h-[400px]'>
            <svg className='w-24 h-24 text-gray-300 dark:text-gray-600 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'></path>
            </svg>
            <p className='text-center text-gray-500 dark:text-gray-400 text-lg'>No instructors available at the moment</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
            {instructors.map((instructor, i) => (
              <div 
                key={instructor._id || i} 
                className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700'
              >
                {/* Card Content */}
                <div className='p-6 flex flex-col items-center'>
                  {/* Image Container */}
                  <div className='relative mb-4'>
                    <div className='absolute inset-0 bg-black dark:bg-white rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity'></div>
                      <img 
                        className='relative rounded-full border-4 border-white dark:border-gray-700 h-28 w-28 object-cover shadow-sm' 
                        src={instructor?.photoUrl || img} 
                        alt={instructor?.name || 'Instructor'} 
                        onError={(e) => { e.target.src = img }}
                      />
                    {/* Online Status Badge */}
                    <div className='absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800'></div>
                  </div>
                  
                  {/* Instructor Info */}
                  <div className='text-center w-full'>
                    <h3 className='font-bold text-xl text-gray-800 dark:text-white mb-1 truncate'>
                      {instructor?.name}
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 text-sm mb-3 truncate'>
                      {instructor?.email}
                    </p>
                    
                    {/* Additional Info */}
                    <div className='space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700'>
                      {instructor?.address && (
                        <div className='flex items-center justify-center text-sm text-gray-600 dark:text-gray-400'>
                          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                          </svg>
                          <span className='truncate'>{instructor?.address}</span>
                        </div>
                      )}
                      
                      {instructor?.phone && (
                        <div className='flex items-center justify-center text-sm text-gray-600 dark:text-gray-400'>
                          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                          </svg>
                          <span>{instructor?.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <button 
                      onClick={() => navigate(`/instructor/${instructor._id}`)}
                      className='mt-4 w-full bg-primary from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-md'>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Instructors