import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import AuthGuard from '../guards/AuthGuard'
import AuthLayout from '../layouts/AuthLayout'
import AuthPage from '../pages/auth/AuthPage'
import RouteGuard from '../guards/RouteGuard'
import { Home } from '../pages/home/Home'
import Logout from '../pages/auth/Logout'

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
          path: '/logout',
          element: <Logout />,
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
          children: [
            {
              path: '/',
              element: (
                <RouteGuard
                  requiredRoles={['admin', 'customer', 'store_owner']}>
                  <Home />
                </RouteGuard>
              ),
            },
          ],
        },
      ],
    },
  ])

export default appRouter
