import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/components/layout';
import ErrorPage from '@/pages/ErrorPage';
import { ROUTES } from './constants';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOMEPAGE,
        async lazy() {
          const { default: Component } = await import('@/pages/Landingpage');

          return { Component };
        },
      },
    ],
  },
]);
