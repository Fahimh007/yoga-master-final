import React from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import { useState, useEffect } from 'react';
import img from '../../../assets/home/girl.png'

const PopularTeacher = () => {
  const api = useAxiosFetch();
  const [Instructors, setInstructors] = useState([]);
  const [loading, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchInstructors = async () => {
        try {
          const response = await api.get('/popular-instructors');
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
    <div className='md:w-[80%] mx-auto my-36'>
      <div>
        <h1 className='text-5xl font-bold text-center text-black dark:text-white'>
          Our <span className='text-secondary'>Best</span> Instructors
        </h1>
      </div>

      <div className='w-[40%] mx-auto mt-4 text-center'>
        <p className='text-gray-500'>
          Explore our best instructors. Here are some popular instructors based on how many students enrolled
        </p>
      </div>

      {loading ? (
        <div className='text-center mt-10'>Loading...</div>
      ) : error ? (
        <div className='text-center mt-10 text-red-500'>Error: {error}</div>
      ) : (
        <div className='grid mb-28 md:grid-cols-2 lg:grid-cols-4 w-[90%] gap-4 mx-auto mt-10'>
          {Instructors.length === 0 ? (
            <p className='text-center text-gray-500'>No data available</p>
          ) : (
            Instructors.slice(0, 4).map((instructor, i) => (
              <div key={i} className='flex dark:text-white hover:-translate-y-2 duration-200 cursor-pointer flex-col shadow-md py-8 px-10 md:px-8 rounded-md'>
                <img 
                  className='rounded-full border-4 border-gray-300 h-24 w-24 mx-auto' 
                  src={instructor?.instructor?.photoUrl || img} 
                  alt={instructor?.instructor?.name || 'Instructor'} 
                />
                <div className='text-center mt-4'>
                  <h3 className='font-semibold text-lg'>{instructor?.instructor?.name}</h3>
                  <p className='text-gray-500 text-sm'>{instructor?.instructor?.email}</p>
                  <p className='text-secondary mt-2'>Total Students: {instructor?.totalEnrolled}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default PopularTeacher