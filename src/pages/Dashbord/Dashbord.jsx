import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { FaUsers, FaBook, FaShoppingCart, FaChartLine, FaCreditCard } from 'react-icons/fa'

const Dashbord = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    enrolledClasses: 3,
    completedClasses: 1,
    cartItems: 2,
    totalSpent: 250,
  })
  const [role, setRole] = useState('user')

  // Get role from user's role in profile (default to 'user')
  useEffect(() => {
    // For now, default to 'user' - in a real app, this would come from the user profile
    setRole('user');
    console.log('Dashboard component mounted');
  }, [])

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your enrollments and progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaBook}
          title="Enrolled Classes"
          value={stats?.enrolledClasses || 0}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={FaChartLine}
          title="Completed Classes"
          value={stats?.completedClasses || 0}
          bgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Cart Items"
          value={stats?.cartItems || 0}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={FaCreditCard}
          title="Total Spent"
          value={`$${stats?.totalSpent || 0}`}
          bgColor="bg-orange-50 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Welcome to YogaMaster Dashboard!</h3>
        <p className="mb-4">
          Browse and enroll in yoga classes that match your fitness level and schedule.
        </p>
        <p className="text-sm opacity-90">Last login: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton title="Browse Classes" description="Find new yoga classes" color="blue" />
          <QuickActionButton title="My Cart" description="View your shopping cart" color="green" />
          <QuickActionButton title="Payment History" description="View transactions" color="purple" />
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, bgColor, iconColor }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`${iconColor} text-4xl opacity-20`}>
          <Icon />
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
const QuickActionButton = ({ title, description, color }) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-900',
    green: 'hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-900',
    purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-900',
  }

  return (
    <button className={`border-2 rounded-lg p-4 text-left transition-colors ${colorClasses[color]}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </button>
  )
}

export default Dashbord
