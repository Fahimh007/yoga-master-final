import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import Card from './Card';

const Popular = () => {
  const api = useAxiosFetch();
  const [classes, setClasses] = useState([]);
  const [loading, setLoader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoader(false);
      }
    };
    fetchClasses();
  }, [api]);

  
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className='md:w-[80%] mx-auto my-36'>
      <div>
        <h1 className='text-5xl font-bold text-center text-black dark:text-white'>
          Our <span className='text-secondary'>Popular</span> Classes
        </h1>
      </div>

      <div className='w-[40%] mx-auto mt-4 text-center'>
        <p className='text-gray-500'>
          Explore our popular classes. Here is some popular classes based on how many student enrolled
        </p>
      </div>

      <div className='mt-8'>
        {classes.length === 0 ? (
          <p className='text-center text-gray-500'>No classes available</p>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {classes.slice(0,6).map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Popular
