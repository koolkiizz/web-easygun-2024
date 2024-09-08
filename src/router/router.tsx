import { createBrowserRouter } from 'react-router-dom';

import PrimaryLayout from '@/components/layout/primary-layout';
import ErrorPage from '@/pages/ErrorPage';
import { ROUTES } from './constants';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <PrimaryLayout />,
    children: [
      {
        path: ROUTES.HOMEPAGE,
        async lazy() {
          const { default: Component } = await import('@/pages/Landingpage');

          return { Component };
        },
      },
      {
        path: ROUTES.LOGIN,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/login');

          return { Component };
        },
      },
      {
        path: ROUTES.SIGNUP,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/sign-up');

          return { Component };
        },
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/forgot-password');

          return { Component };
        },
      },
    ],
  },
]);
