import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, duration } from '@mui/material/styles';
import { IoMenu } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import photoUrl from '../../assets/home/girl.png';
import {motion} from 'framer-motion';
import { AuthContext } from '../../utlities/providers/AuthProvider';
import Swal from 'sweetalert2';

const navlinks = [
    { name: 'Home', path: '/' },
    { name: 'Classes', path: '/classes' },
    { name: 'Instructors', path: '/instructors' },
];

// Define the theme
const theme = createTheme({
    palette: {
        mode: 'light', // Default mode
        primary: {
            main: '#1E40AF',
        },
        secondary: {
            main: '#FBBF24',
        },
    },
});

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHome, setIsHome] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isFixed, setIsFixed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' || false 
    );
    // const [user, setUser] = useState(true);
    const [navBg, setNavBg] = useState('bg-[#15151580]');

    const {logout, user} = useContext(AuthContext);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

  
    useEffect(() => {
        const darkClass = 'dark';
        const root = window.document.documentElement;

        if (isDarkMode) {
            root.classList.add(darkClass);
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove(darkClass);
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        setIsHome(location.pathname === '/');
        setIsLogin(location.pathname === '/login');
        setIsFixed(location.pathname === '/register' || location.pathname === '/login');
    },[location.pathname]);

    useEffect(() => {
        if (scrollPosition > 100) {
            setNavBg('bg-white backdrop-filter backdrop-blur-xl bg-opacity-0 dark:text-white');
        } else {
            setNavBg('bg-transparent dark:text-white text-white');
        }
    }, [scrollPosition, isHome]);

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout me!"
        }).then((result) => {
            if (result.isConfirmed) {
                logout()
                .then(() => {
                    Swal.fire({
                    title: "Logged Out!",
                    text: "Your successfully logged out.",
                    icon: "success"
                });
                })
                .catch((error) => {
                    swal.fire("Error!", error.message, "error");
                });
              
            }
        });
    }

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <motion.nav 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        className={`${navBg} ${isFixed ? '' : 'fixed top-0 left-0 w-full z-50 shadow-md'} transition-colors duration-300`}>
            <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
                <div className="px-4 py-4 flex items-center justify-between text-black dark:text-white">
                    {/* logo */}
                    <div className='text-black dark:text-white'>
                        <h1 className="text-2xl inline-flex items-center gap-3 font-bold">
                            YogaMaster
                            <img src="/yoga.png" alt="yogaLogo" className="w-10 h-10" />
                        </h1>
                        <p className="font-bold text-[13px] tracking-[8px]">Quick Explore</p>
                    </div>
                    <div className="md:hidden flex items-center  ">
                        <button type='button' onClick={toggleMobileMenu} className='text-gray-300'>
                            <IoMenu className='h-6 w-6'/>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden">
                            <ul className="flex flex-col space-y-2 p-4">
                                {navlinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `font-bold block px-3 py-2 rounded ${
                                                    isActive
                                                        ? 'text-secondary bg-gray-100 dark:bg-gray-800'
                                                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                } duration-300`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {user ? null : isLogin ? (
                                    <li>
                                        <NavLink
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `font-bold block px-3 py-2 rounded ${
                                                    isActive
                                                        ? 'text-secondary bg-gray-100 dark:bg-gray-800'
                                                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                } duration-300`
                                            }
                                        >
                                            Register
                                        </NavLink>
                                    </li>
                                ) : (
                                    <li>
                                        <NavLink
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `font-bold block px-3 py-2 rounded ${
                                                    isActive
                                                        ? 'text-secondary bg-gray-100 dark:bg-gray-800'
                                                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                } duration-300`
                                            }
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                )}
                                {user && (
                                    <li>
                                        <NavLink 
                                            to="/dashboard" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `font-bold block px-3 py-2 rounded ${
                                                    isActive
                                                        ? 'text-secondary bg-gray-100 dark:bg-gray-800'
                                                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                } duration-300`
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                {user && (
                                    <li className="flex items-center px-3 py-2">
                                        <img 
                                            src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'User') + '&background=random'} 
                                            alt='user' 
                                            className='h-10 w-10 rounded-full'
                                        />
                                        <span className="ml-3 text-black dark:text-white font-semibold">{user?.displayName || 'User'}</span>
                                    </li>
                                )}
                                {user && (
                                    <li>
                                        <button 
                                            onClick={(e) => {
                                                setMobileMenuOpen(false);
                                                handleLogout(e);
                                            }}
                                            className='font-bold w-full text-left px-3 py-2 bg-secondary text-white rounded hover:bg-secondary/90 duration-300'
                                        >
                                            Logout
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <div className="flex items-center px-3 py-2">
                                        <ThemeProvider theme={theme}>
                                            <Switch onChange={() => setIsDarkMode(!isDarkMode)} size="small" />
                                        </ThemeProvider>
                                        <span className="text-xs text-black dark:text-white ml-2">Light/Dark</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                    <div className="hidden md:block">
                        <div className="flex">
                            <ul className="ml-10 flex items-center space-x-4 pr-4">
                                {navlinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink
                                            to={link.path}
                                            style={{whiteSpace : 'nowrap'}}
                                            className={({ isActive }) =>
                                                `font-bold ${
                                                    isActive
                                                        ? 'text-secondary'
                                                        : `${isDarkMode ? 'text-white' : 'text-black'}`
                                                } hover:text-secondary duration-30`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {user ? null : isLogin ? (
                                    <li>
                                        <NavLink
                                            to="/register"
                                            className={({ isActive }) =>
                                                `font-bold ${
                                                    isActive
                                                        ? 'text-secondary'
                                                        : `${isDarkMode ? 'text-white' : 'text-black'}`
                                                } hover:text-secondary duration-30`
                                            }
                                        >
                                            Register
                                        </NavLink>
                                    </li>
                                ) : (
                                    <li>
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) =>
                                                `font-bold ${
                                                    isActive
                                                        ? 'text-secondary'
                                                        : `${isDarkMode ? 'text-white' : 'text-black'}`
                                                } hover:text-secondary duration-30`
                                            }
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                )}
                                {user && (
                                    <li>
                                        <NavLink to="/dashboard" className={({ isActive }) =>
                                                `font-bold ${
                                                    isActive
                                                        ? 'text-secondary'
                                                        : `${isDarkMode ? 'text-white' : 'text-black'}`
                                                } hover:text-secondary duration-30`
                                            }>Dashboard</NavLink>
                                    </li>
                                )}
                                {
                                    //if user is logged in, show all image
                                    user && <li>     
                                        <img 
                                            onClick={() => navigate('/user-profile')}
                                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`} 
                                            alt='user' 
                                            className=' h-[40px] rounded-full w-[40px] cursor-pointer object-cover'
                                        />
                                    </li>
                                }
                                {
                                    user && <li><NavLink onClick={handleLogout} className={'font-bold px-3 py-2 bg-primary text-white rounded'}>LogOut</NavLink></li>
                                }

                                <li>
                                    <ThemeProvider theme={theme}>
                                        <div className="flex flex-col items-center">
                                            <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                                            <h1 className="text-[8px]"> Light/Dark</h1>
                                        </div>
                                    </ThemeProvider>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;