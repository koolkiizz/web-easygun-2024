import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './components/auth/auth-provider';
import { Toaster } from './components/ui/toaster';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={undefined} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
