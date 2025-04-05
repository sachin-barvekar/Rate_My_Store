import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import AuthGuard from '../guards/AuthGuard'
import AuthLayout from '../layouts/AuthLayout'
import AuthPage from '../pages/auth/AuthPage'
import RouteGuard from '../guards/RouteGuard'
import HomePage from '../pages/home'
import Logout from '../pages/auth/Logout'
import UserList from '../pages/users/userList/UserList'
import StoreList from '../pages/store/storeList/StoreList'
import MyStoreRatingList from '../pages/store/storeRatings/MyStoreRatingsList'

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
          element: (
            <AuthGuard>
              <AuthLayout />
            </AuthGuard>
          ),
          children: [
            {
              path: '/',
              element: (
                <RouteGuard requiredRoles={['admin', 'user', 'store_owner']}>
                  <HomePage />
                </RouteGuard>
              ),
            },
            {
              path: '/users',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <UserList />
                </RouteGuard>
              ),
            },
            {
              path: '/stores',
              element: (
                <RouteGuard requiredRoles={['admin', 'user']}>
                  <StoreList />
                </RouteGuard>
              ),
            },
            {
              path: '/ratings',
              element: (
                <RouteGuard requiredRoles={['store_owner']}>
                  <MyStoreRatingList />
                </RouteGuard>
              ),
            },
            {
              path: '*',
              element: <Navigate to='/' replace />,
            },
          ],
        },
        {
          path: '*',
          element: <Navigate to='/auth' replace />,
        },
      ],
    },
  ])

export default appRouter
