import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import AuthGuard from '../guards/AuthGuard'
import AuthLayout from '../layouts/AuthLayout'
import AuthPage from '../pages/auth/AuthPage'

const appRouter = () =>
  createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/auth',
          element: <AuthPage />,
        },
        {
          path: '*',
          element: <Navigate to='/auth' replace />,
        },
        {
          element: (
            <AuthGuard>
              <AuthLayout />
            </AuthGuard>
          ),
          children: [],
        },
      ],
    },
  ])

export default appRouter
