// ...existing code...
import React, { createContext, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { app } from '../../config/firebase.init'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loader, setLoader] = useState(true)
  const [error, setError] = useState('')

  const auth = getAuth(app)

  const signup = async (email, password) => {
    try {
      setLoader(true)
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.code)
      throw err
    } finally {
      setLoader(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoader(true)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.code)
      throw err
    } finally {
      setLoader(false)
    }
  }

  const logout = async () => {
    try {
      setLoader(true)
      return await signOut(auth)
    } catch (err) {
      setError(err.code)
      throw err
    } finally {
      setLoader(false)
    }
  }

  const updateUser = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo
      })
      setUser(auth.currentUser)
    } catch (err) {
      setError(err.code)
      throw err
    }
  }

  const googleProvider = new GoogleAuthProvider()
  const googleLogin = async () => {
    if (!navigator.onLine) {
      setError('No internet connection.')
      throw new Error('Offline')
    }
    try {
      setLoader(true)
      // Suppress CORS warning; popup is handled by browser
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (err) {
      console.error('Google login error:', err?.code)
      setError(err?.code || err?.message)
      throw err
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u?.email)
      setUser(u)
      setLoader(false)
      if (u?.email) {
        axios
          .post('https://yoga-master-1.onrender.com/api-set-token', {
            email: u.email,
            name: u.displayName
          })
          .then((res) => {
            console.log('Token received:', res?.data?.token ? 'Yes' : 'No')
            if (res?.data?.token) {
              localStorage.setItem('yoga-token', res.data.token)
              console.log('Token saved to localStorage')
            }
          })
          .catch((err) => {
            console.error('Error getting token:', err.message)
            localStorage.removeItem('yoga-token')
          })
      } else {
        console.log('User logged out, removing token')
        localStorage.removeItem('yoga-token')
      }
    })
    return () => unsubscribe()
  }, [auth])

  const contextValue = useMemo(
    () => ({ user, signup, login, logout, updateUser, googleLogin , error, setError, loader, setLoader }),
    [user]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
// ...existing code...