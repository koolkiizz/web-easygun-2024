import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './components/auth/auth-provider';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={undefined} />
    </AuthProvider>
  );
}

export default App;
