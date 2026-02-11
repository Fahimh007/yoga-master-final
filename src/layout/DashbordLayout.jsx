import useUser from '../hooks/useUser';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChartBar, FaFileAlt, FaUserTie, FaShoppingCart, FaClipboardList, FaChartLine, FaCreditCard } from 'react-icons/fa';

const DashbordLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout, user } = useAuth();
    const { currentUser, isLoading } = useUser();
    const navigate = useNavigate();
    
    // Use currentUser's role if available, otherwise default to 'user'
    const role = currentUser?.role || 'user';
    const location = useLocation();
    
    // Provide fallback user info if currentUser is not loaded yet
    const displayName = currentUser?.name || user?.displayName || 'User';
    const displayEmail = currentUser?.email || user?.email || 'user@example.com';
    const displayPhoto = currentUser?.photoUrl || user?.photoURL || 'https://via.placeholder.com/40';

    // Debug logs
    useEffect(() => {
        console.log('DashbordLayout Debug:', { 
            user: user?.email, 
            currentUser, 
            isLoading, 
            role 
        });
    }, [user, currentUser, isLoading, role]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user?.email && !isLoading) {
            navigate('/login', { replace: true });
        }
    }, [user?.email, isLoading, navigate]);

    // Define menu items based on role
    const getMenuItems = () => {
        if (role === 'admin') {
            return [
                { label: 'Dashboard', icon: FaHome, path: '/dashboard' },
                { label: 'Manage Users', icon: FaUsers, path: '/dashboard/manage-users' },
                { label: 'Manage Classes', icon: FaBook, path: '/dashboard/manage-classes' },
                { label: 'Manage Instructors', icon: FaUserTie, path: '/dashboard/manage-instructors' },
                { label: 'Statistics', icon: FaChartBar, path: '/dashboard/statistics' },
                { label: 'Settings', icon: FaCog, path: '/dashboard/settings' },
            ];
        } else if (role === 'instructor') {
            return [
                { label: 'Dashboard', icon: FaHome, path: '/dashboard' },
                { label: 'My Classes', icon: FaBook, path: '/dashboard/my-classes' },
                { label: 'Add Class', icon: FaFileAlt, path: '/dashboard/add-class' },
                { label: 'Enrolled Students', icon: FaUsers, path: '/dashboard/enrolled-students' },
                { label: 'My Statistics', icon: FaChartBar, path: '/dashboard/my-statistics' },
                { label: 'Profile', icon: FaCog, path: '/dashboard/profile' },
            ];
        } else {
            // User role
            return [
                { label: 'Dashboard', icon: FaHome, path: '/dashboard' },
                { label: 'My Enrollments', icon: FaBook, path: '/dashboard/my-enrollments' },
                { label: 'My Cart', icon: FaShoppingCart, path: '/dashboard/my-cart' },
                { label: 'Payment History', icon: FaClipboardList, path: '/dashboard/payment-history' },
                { label: 'Profile', icon: FaCog, path: '/dashboard/profile' },
            ];
        }
    };

    const menuItems = getMenuItems();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    // If user is not authenticated, ProtectedRoute will handle redirect
    // So we can safely render the dashboard here
    
    // Show minimal loading state only on first load
    if (isLoading && !currentUser && !displayName) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 fixed h-screen flex flex-col z-40 shadow-lg`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {sidebarOpen && <h2 className="text-xl font-bold text-primary">YogaMaster</h2>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <img
                            src={displayPhoto}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {sidebarOpen && (
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{displayName}</p>
                                <p className="text-xs text-gray-400 capitalize">{role}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    active
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800'
                                }`}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <Icon size={20} className="min-w-max" />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200 ${
                            !sidebarOpen && 'justify-center'
                        }`}
                        title={!sidebarOpen ? 'Logout' : ''}
                    >
                        <FaSignOutAlt size={20} className="text-secondary min-w-max" />
                        {sidebarOpen && <span className="text-white text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col overflow-auto transition-all duration-300`}>
                {/* Top Bar */}
                <div className="bg-white dark:bg-gray-800 shadow-md p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {role === 'admin' && 'Admin Dashboard'}
                            {role === 'instructor' && 'Instructor Dashboard'}
                            {role === 'user' && 'My Dashboard'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Welcome back, {displayName}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            ← Back to Home
                        </button>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayEmail}</p>
                            <p className={`text-xs font-medium capitalize px-3 py-1 rounded-full ${
                                role === 'admin' ? 'bg-red-100 text-red-800' :
                                role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-800">
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
                                value={3}
                                bgColor="bg-blue-50 dark:bg-blue-900/20"
                                iconColor="text-blue-600 dark:text-blue-400"
                            />
                            <StatCard
                                icon={FaChartLine}
                                title="Completed Classes"
                                value={1}
                                bgColor="bg-green-50 dark:bg-green-900/20"
                                iconColor="text-green-600 dark:text-green-400"
                            />
                            <StatCard
                                icon={FaShoppingCart}
                                title="Cart Items"
                                value={2}
                                bgColor="bg-purple-50 dark:bg-purple-900/20"
                                iconColor="text-purple-600 dark:text-purple-400"
                            />
                            <StatCard
                                icon={FaCreditCard}
                                title="Total Spent"
                                value="$250"
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
                </div>
            </div>
        </div>
    );
};

export default DashbordLayout;

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
