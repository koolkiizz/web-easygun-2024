import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/router/constants';

interface VerifyStatusProps {
  verifyEmail: number;
  className?: string;
}

const VerifyStatus: React.FC<VerifyStatusProps> = ({ verifyEmail, className }) => {
  const getVerificationStatus = () => {
    switch (verifyEmail) {
      case 0:
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: 'Chưa xác thực',
          description: 'Tài khoản chưa được xác thực email',
          actions: (
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/verify-email">Xác thực email</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/duplicate-verify-email">Xác thực email 2 lớp</Link>
              </Button>
            </div>
          ),
        };
      case 1:
        return {
          variant: 'default' as const,
          icon: <Shield className="h-4 w-4" />,
          title: 'Xác thực một phần',
          description: 'Tài khoản đã xác thực email nhưng chưa xác thực 2 lớp',
          actions: (
            <div className="mt-2">
              <Button variant="default" size="sm" asChild>
                <Link to={ROUTES.DUPLICATE_VERIFY}>Xác thực email 2 lớp</Link>
              </Button>
            </div>
          ),
        };
      case 2:
        return {
          variant: 'default' as const,
          icon: <CheckCircle2 className="h-4 w-4" />,
          title: 'Đã xác thực',
          description: 'Tài khoản đã được xác thực đầy đủ',
          actions: null,
        };
      default:
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: 'Trạng thái không xác định',
          description: 'Không thể xác định trạng thái xác thực của tài khoản',
          actions: (
            <div className="flex flex-col gap-[12px]">
              <Button variant="default" size="sm" asChild>
                <Link to={ROUTES.VERIFy_EMAIL}>Xác thực email</Link>
              </Button>
              <Button variant="outline" size="sm" asChild disabled>
                <Link to={ROUTES.DUPLICATE_VERIFY}>Xác thực email 2 lớp</Link>
              </Button>
            </div>
          ),
        };
    }
  };

  const status = getVerificationStatus();

  return (
    <Alert variant={status.variant} className={cn('flex flex-col items-start', className)}>
      <div className="flex items-center gap-2">
        {status.icon}
        <AlertTitle>{status.title}</AlertTitle>
      </div>
      <AlertDescription className="mt-1">{status.description}</AlertDescription>
      {status.actions}
    </Alert>
  );
};

export default VerifyStatus;
