import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/router/constants';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate(ROUTES.HOMEPAGE);
  });

  return <>...logout</>;
};
export default Logout;
