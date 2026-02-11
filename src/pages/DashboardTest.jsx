import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashboardTest = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Test</h1>
          
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Current User:</p>
              <pre className="text-xs mt-2 bg-blue-900 text-blue-100 p-3 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            {user?.email ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-green-900 dark:text-green-100">✓ User is authenticated</p>
                <p className="text-green-900 dark:text-green-100">Email: {user.email}</p>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <p className="text-red-900 dark:text-red-100">✗ No user authenticated</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => logout().then(() => navigate('/login'))}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTest
