import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'          
import { ToastContainer } from 'react-toastify' 
import { BrowserRouter, Routes, Route, Link, createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import {router} from './routes/router';
import AuthProvider from './utlities/providers/AuthProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <AuthProvider>
       <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
       </QueryClientProvider>
  </AuthProvider> 
)
