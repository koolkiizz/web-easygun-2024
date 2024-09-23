import { useContext } from 'react';

import { AuthContext } from '@/components/auth/auth-provider';

export function useAuth() {
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);

  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     setIsAuthenticated(!!token);
  //   }, []);

  //   const login = (token: string) => {
  //     localStorage.setItem('token', token);
  //     setIsAuthenticated(true);
  //   };

  //   const logout = () => {
  //     localStorage.removeItem('token');
  //     setIsAuthenticated(false);
  //   };

  //   return { isAuthenticated, login, logout };
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
