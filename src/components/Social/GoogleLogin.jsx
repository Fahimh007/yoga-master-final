
import { FaGoogle } from 'react-icons/fa'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { app } from '../../config/firebase.init'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../utlities/providers/AuthProvider'

const GoogleLogin = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const auth = getAuth(app)
  const googleProvider = new GoogleAuthProvider()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Set user in context
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })

      // Create new user in database if first time login
      const newUser = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        role: 'user',
        createdAt: new Date(),
      }

      // Save user to backend
      fetch('https://yoga-master-1.onrender.com/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
        .then(res => res.json())
        .then(data => console.log('User saved:', data))
        .catch(err => console.log('Error saving user:', err))

      // Navigate to dashboard or home
      navigate('/')
    } catch (error) {
      console.error('Google Login Error:', error.message)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className='w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-200 mb-4'
    >
      <FaGoogle className='text-red-500' />
      Sign in with Google
    </button>
  )
}

export default GoogleLogin
