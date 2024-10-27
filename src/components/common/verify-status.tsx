import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { ROUTES } from '@/router/constants';

interface VerifyStatusProps {
  verifyEmail: number;
  actived2fa: number;
  className?: string;
}

const VerifyStatus: React.FC<VerifyStatusProps> = ({ verifyEmail, actived2fa, className }) => {
  const steps = [
    {
      title: 'Xác thực email',
      description: 'Xác nhận địa chỉ email của bạn',
      path: ROUTES.VERIFy_EMAIL,
    },
    {
      title: 'Xác thực 2 lớp',
      description: 'Thiết lập bảo mật 2 lớp cho tài khoản',
      path: ROUTES.DUPLICATE_VERIFY,
    },
  ];

  const getStepStatus = (stepIndex: number) => {
    // Step 1: Email Verification
    if (stepIndex === 0) {
      if (verifyEmail === 1) return 'completed';
      return verifyEmail === 0 ? 'current' : 'pending';
    }

    // Step 2: 2FA Verification
    if (stepIndex === 1) {
      // Only show as completed when both verifyEmail and 2FA are active
      if (verifyEmail === 1 && actived2fa === 1) return 'completed';
      // Show as current when email is verified but 2FA isn't
      if (verifyEmail === 1 && actived2fa === 0) return 'current';
      // Otherwise pending
      return 'pending';
    }

    return 'pending';
  };

  // Check if all verifications are complete
  const isFullyVerified = verifyEmail === 1 && actived2fa === 1;

  return (
    <div className={cn('w-full p-6 rounded-lg border bg-card', className)}>
      <h3 className="text-lg font-semibold mb-6">Trạng thái xác thực tài khoản</h3>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const status = getStepStatus(index);

          return (
            <div key={index} className="relative">
              {/* Connection line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={cn('absolute left-[30px] top-[48px] h-[calc(100%)] w-[2px]', {
                    'bg-primary': status === 'completed',
                    'bg-primary/50': status === 'current',
                    'bg-muted': status === 'pending',
                  })}
                />
              )}

              <div
                className={cn('flex items-start gap-4 p-4 rounded-lg transition-colors', {
                  'bg-primary/5 border border-primary/20': status === 'current',
                  'bg-muted/30': status === 'completed',
                })}
              >
                {/* Step indicator */}
                <div className="relative flex h-[30px] w-[30px] shrink-0 items-center justify-center">
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-[30px] w-[30px] text-primary animate-in fade-in text-green-600" />
                  ) : status === 'current' ? (
                    <div className="relative">
                      <CircleDot className="h-[30px] w-[30px] text-primary animate-pulse" />
                      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary bg-red-700 animate-ping" />
                    </div>
                  ) : (
                    <Circle className="h-[30px] w-[30px] text-muted-foreground" />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1">
                  <div
                    className={cn('flex items-center gap-2 text-base font-semibold', {
                      'text-primary': status === 'current',
                      'text-primary/80': status === 'completed',
                      'text-muted-foreground': status === 'pending',
                    })}
                  >
                    <span>{step.title}</span>
                    {status === 'current' && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Bước hiện tại</span>
                    )}
                  </div>

                  <div
                    className={cn('mt-1 text-sm', {
                      'text-muted-foreground': status !== 'current',
                      'text-foreground': status === 'current',
                    })}
                  >
                    {step.description}
                  </div>

                  {/* Action button for current step */}
                  {status === 'current' && (
                    <Link to={step.path} className="underline text-sm text-secondary-foreground">
                      {index === 0 ? 'Đi tới trang xác thực email ' : 'Đi tới trang thiết lập xác thực 2 lớp'}
                    </Link>
                  )}

                  {/* Status indicators */}
                  {status === 'completed' && <p className="mt-2 text-sm text-primary">✓ Đã hoàn thành</p>}
                  {status === 'pending' && <p className="mt-2 text-sm text-muted-foreground">Chờ xử lý</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {isFullyVerified && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-600">
          <CheckCircle2 className="inline-block h-5 w-5 mr-2" />
          Tài khoản của bạn đã được xác thực đầy đủ
        </div>
      )}
    </div>
  );
};

export default VerifyStatus;
