import React, { use } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();
  
  console.log('useUser hook - user.email:', user?.email);
  
  const {data: currentUser, isLoading, refetch, error} = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async() => {
        console.log('useUser queryFn executing for email:', user?.email);
        try {
          const res = await axiosSecure.get(`/user/${user?.email}`);
          console.log('User data fetched successfully:', res.data);
          
          // If user not found in database, create default user object with role
          if (!res.data) {
            console.warn('User not found in database, creating default user object');
            return {
              email: user?.email,
              name: user?.displayName || 'User',
              photoUrl: user?.photoURL || 'https://via.placeholder.com/150',
              role: 'user',
              enrolledClasses: [],
            };
          }
          
          return res.data;
        } catch (err) {
          console.error('Error fetching user:', err);
          // Return minimal user object on error
          return {
            email: user?.email,
            name: user?.displayName || 'User',
            photoUrl: user?.photoURL || 'https://via.placeholder.com/150',
            role: 'user',
            enrolledClasses: [],
          };
        }
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  })
  
  console.log('useUser hook state - currentUser:', currentUser, 'isLoading:', isLoading);
  
  return {currentUser, isLoading, refetch, error};
}

export default useUser