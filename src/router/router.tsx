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
      {
        path: ROUTES.CHANGE_PASSWORD,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/change-password');
          return { Component };
        },
      },
      {
        path: ROUTES.VERIFy_EMAIL,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/verify-email');
          return { Component };
        },
      },
      {
        path: ROUTES.DUPLICATE_VERIFY,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/duplicate-verification');
          return { Component };
        },
      },
      {
        path: ROUTES.CHANGE_EMAIL,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/change-email');
          return { Component };
        },
      },
      {
        path: ROUTES.LOGOUT,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/log-out');
          return { Component };
        },
      },
      {
        path: ROUTES.ADD_COIN,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/add-coin');
          return { Component };
        },
      },
      {
        path: ROUTES.TRANSFER_COIN,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/transfer-coin');
          return { Component };
        },
      },
      {
        path: ROUTES.CLEAR_BAG,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/clear-bag');
          return { Component };
        },
      },
      {
        path: ROUTES.HISTORY,
        async lazy() {
          const { default: Component } = await import('@/pages/Auth/history-transfer');
          return { Component };
        },
      },
    ],
  },
]);
