import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import useUser from '../../hooks/useUser'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { toast } from 'react-toastify';

const Classes = () => {
  const api = useAxiosFetch()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const { user } = useAuth()           // firebase auth user (has email)
  const { currentUser } = useUser()
  const [classes, setClasses] = useState([])
  const [loading, setLoader] = useState(true)
  const [error, setError] = useState(null)
  const [hoverCard, setHoverCard] = useState(null)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const nevigate = useNavigate();

  // const notify = () => toast('Wow so easy !');

  useEffect(() => {
    let mounted = true
    setLoader(true)
    setError(null)

    api.get('/classes')
      .then(res => {
        if (!mounted) return
        setClasses(Array.isArray(res.data) ? res.data : [])
      })
      .catch(err => {
        if (!mounted) return
        console.error('fetch /classes error', err)
        setError('Failed to load classes')
      })
      .finally(() => { if (mounted) setLoader(false) })

    return () => { mounted = false }
  }, [api])

  // Fetch enrolled classes for logged-in user from user profile
  useEffect(() => {
    if (!user?.email || !currentUser) {
      setEnrolledClasses([])
      return
    }

    // Get enrolledClasses from user profile
    const enrolledClassIds = currentUser?.enrolledClasses || []
    setEnrolledClasses(enrolledClassIds)
    console.log('Enrolled classes from user profile:', enrolledClassIds)
  }, [user?.email, currentUser])

  const handleSelect = async (classId) => {
    // Must be logged in - check BEFORE any API calls
    if (!user?.email) {
      toast.error('Please login to enroll in a class')
      navigate('/login')
      return
    }

    // Check if currentUser data is loaded
    if (!currentUser) {
      toast.error('Please wait, loading your profile...')
      return
    }

    // Role check: admin/instructor cannot enroll
    const role = currentUser?.role
    if (role === 'admin' || role === 'instructor') {
      toast.error('Admins and instructors cannot enroll in classes.')
      return
    }

    // Find class data locally
    const selectedClass = classes.find(c => c._id === classId)
    if (!selectedClass) {
      toast.error('Class not found')
      return
    }

    // Seats check
    const seatsLeft = (selectedClass.availableSeats ?? 0) - (selectedClass.totalEnrolled ?? 0)
    if (seatsLeft <= 0) {
      toast.error('No seats available for this class.')
      return
    }

    // Check if already enrolled using user profile data
    if (enrolledClasses.includes(classId)) {
      toast.info('You already enrolled in this class.')
      return
    }

    try {
      // Prepare payload for /add-to-cart
      const payload = {
        classId: classId,
        name: selectedClass.name,
        price: selectedClass.price,
        userMail: user.email,
        instructorEmail: selectedClass.instructorEmail || selectedClass.instructorEmail,
        image: selectedClass.image
      }

      const addRes = await axiosSecure.post('/add-to-cart', payload)
      console.log(addRes)
      
      // Backend returns insert result; check insertedId or status
      if (addRes?.data?.insertedId || addRes.status === 200 || addRes.status === 201) {
        toast.success('Class selected successfully. Proceed to cart to checkout.')
        // Update enrolled classes state to show "Enrolled" button
        setEnrolledClasses([...enrolledClasses, classId])
      } else {
        toast.error('Could not select class.')
      }
    } catch (err) {
      console.error('Select error:', err)
      if (err?.response?.status === 401) {
        toast.error('Unauthorized. Please login again.')
        navigate('/login')
      } else {
        toast.error('Failed to select class. Please try again.')
      }
    }
  }

  if (loading) return <div className="p-8 text-center">Loading classes...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="px-40 pt-20 pb-12 pt-40">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-secondary">Classes</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
          Browse available classes and enroll. Click "View" to open class detail.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No classes available</p>
        ) : classes.slice(0,6).map((cls, i) => (
          <article
            key={cls._id}
            onMouseEnter={() => setHoverCard(i)}
            onMouseLeave={() => setHoverCard(null)}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 ${hoverCard === i ? 'transform -translate-y-1 ring-2 ring-primary/40' : ''}`}
          >
            <div className="relative h-44">
              <img src={cls.image} alt={cls.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded bg-black/60 text-white">
                {cls.status?.toUpperCase() || 'UNKNOWN'}
              </span>
              <span className="absolute top-3 right-3 bg-secondary text-white text-sm font-semibold px-3 py-1 rounded">
                ${cls.price}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cls.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">By {cls.instructorName}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 h-14 overflow-hidden">{cls.description}</p>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Enrolled</div>
                    <div className="font-semibold">{cls.totalEnrolled ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Seats left</div>
                    <div className="font-semibold">{Math.max((cls.availableSeats ?? 0) - (cls.totalEnrolled ?? 0), 0)}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Submitted</div>
                  <div className="text-sm">{cls.submitted ? new Date(cls.submitted).toLocaleDateString() : '-'}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md">
              <Link to={`/class/${cls._id}`} className="basis-[80%]">
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md text-sm">View</button>
              </Link>

              <div className="basis-[20%]">
                {!user?.email ? (
                  // Not logged in - show Login button
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-2 rounded-md text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                    title="Please login to enroll in classes"
                  >
                    Enroll
                  </button>
                ) : (
                  // Logged in - show Enroll/Enrolled button
                  <button
                    onClick={()=> handleSelect(cls._id)} 
                    disabled={(cls.availableSeats ?? 0) - (cls.totalEnrolled ?? 0) <= 0 || enrolledClasses.includes(cls._id)}
                    className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
                      enrolledClasses.includes(cls._id)
                        ? 'bg-green-500 text-white cursor-default'
                        : (cls.availableSeats ?? 0) - (cls.totalEnrolled ?? 0) <= 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-secondary text-white hover:opacity-90'
                    }`}
                    title={
                      enrolledClasses.includes(cls._id)
                        ? 'Already enrolled'
                        : (cls.availableSeats ?? 0) - (cls.totalEnrolled ?? 0) <= 0
                        ? 'No seats available'
                        : 'Click to enroll in this class'
                    }
                  >
                    {enrolledClasses.includes(cls._id) ? 'Enrolled' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Classes