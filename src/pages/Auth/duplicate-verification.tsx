import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import VerifyStatus from '@/components/common/verify-status';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDuplicateVerify, useRequestDuplicateVerify } from '@/hooks/useVerify';

type FormData = {
  verificationCode: string;
};

const COUNTDOWN_TIME = 60;

const EmailVerificationFlow: React.FC = () => {
  // States
  const [step, setStep] = useState<'check' | 'verify'>('check');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error' | 'timeout'>('idle');
  const [countdown, setCountdown] = useState(0);

  // Hooks
  const { toast } = useToast();
  const { userInfo, updateUserInfo } = useAuth();
  const { requestDuplicateVerify, isLoading: isLoadingRequest } = useRequestDuplicateVerify();
  const { duplicateVerify, isLoading: isLoadingSubmit } = useDuplicateVerify();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setVerificationStatus('timeout');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handlers
  const handleRequestCode = async () => {
    try {
      const response = await requestDuplicateVerify();
      if (response) {
        setStep('verify');
        setCountdown(COUNTDOWN_TIME);
        setVerificationStatus('idle');
        reset(); // Reset form when requesting new code
        toast({
          title: 'Mã xác thực đã được gửi',
          description: 'Vui lòng kiểm tra email của bạn',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể gửi mã xác thực',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi gửi mã xác thực',
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (countdown <= 0) {
      setVerificationStatus('timeout');
      return;
    }

    try {
      const response = await duplicateVerify({ code: data.verificationCode });
      if (response) {
        setVerificationStatus('success');
        updateUserInfo({ ...userInfo, '2fa': '1' });
        toast({
          title: 'Xác thực thành công',
          description: 'Email của bạn đã được xác thực 2 lớp',
        });
        // Return to check step after short delay to show success message
        setTimeout(() => setStep('check'), 2000);
      } else {
        setVerificationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Xác thực thất bại',
          description: 'Mã xác thực không đúng',
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi xác thực',
      });
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    await handleRequestCode();
  };

  const handleBack = () => {
    setStep('check');
    setVerificationStatus('idle');
    reset();
  };

  // Initial step view
  if (step === 'check') {
    return (
      <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="gap-4">
            <CardTitle>Thiết lập xác thực email 2 lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <VerifyStatus verifyEmail={Number(userInfo?.VerifiedEmail)} actived2fa={Number(userInfo?.['2fa'])} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleRequestCode} disabled={Number(userInfo?.VerifiedEmail) !== 1 || isLoadingRequest}>
              {Number(userInfo?.VerifiedEmail) !== 1
                ? 'Tiếp tục'
                : isLoadingRequest
                  ? 'Đang gửi...'
                  : 'Gửi mã xác thực'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Verification step view
  return (
    <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Xác thực 2 lớp</CardTitle>
          <CardDescription>Bước 2: Trạng thái kích hoạt xác thực email 2 lớp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="verificationCode">Xác thực code</Label>
                <Input
                  id="verificationCode"
                  placeholder="Nhập mã số"
                  {...register('verificationCode', {
                    required: 'Xác thực code là bắt buộc',
                  })}
                />
                {errors.verificationCode && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.verificationCode.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Thời gian còn lại: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </p>
              {countdown <= 0 && (
                <Button type="button" variant="outline" onClick={handleResendCode} disabled={isLoadingRequest}>
                  {isLoadingRequest ? 'Đang gửi...' : 'Gửi lại mã'}
                </Button>
              )}
            </div>
          </form>

          {verificationStatus === 'success' && (
            <Alert className="mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>Email của bạn đã được xác thực 2 lớp.</AlertDescription>
            </Alert>
          )}
          {verificationStatus === 'error' && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Thất bại</AlertTitle>
              <AlertDescription>Mã xác thực không đúng. Vui lòng thử lại.</AlertDescription>
            </Alert>
          )}
          {verificationStatus === 'timeout' && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hết giờ</AlertTitle>
              <AlertDescription>Mã xác thực đã hết hạn. Vui lòng nhấn gửi lại mã.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isLoadingSubmit}>
            Quay lại
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoadingSubmit || countdown <= 0}>
            {isLoadingSubmit ? 'Đang xác thực...' : 'Xác thực'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerificationFlow;
