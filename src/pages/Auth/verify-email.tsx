import { AlertCircle } from 'lucide-react';
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
import { useRequestVerifyEmail, useVerifyEmail } from '@/hooks/useVerify';

type FormData = {
  verificationCode: string;
};

const COUNTDOWN_TIME = 60;

const VerifyEmailPage: React.FC = () => {
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const { verifyEmail } = useVerifyEmail();
  const { requestVerifyEmail } = useRequestVerifyEmail();
  const { userInfo, updateUserInfo } = useAuth();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestVerify = async () => {
    try {
      setIsRequestingCode(true);
      const response = await requestVerifyEmail();
      if (response) {
        toast({
          title: 'Mã xác thực đã được gửi',
          description: 'Vui lòng kiểm tra email của bạn',
        });
        setShowVerifyForm(true);
        setCountdown(COUNTDOWN_TIME);
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
    } finally {
      setIsRequestingCode(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await verifyEmail({ code: data.verificationCode });
      if (!response) {
        toast({
          variant: 'destructive',
          title: 'Xác thực thất bại',
          description: 'Mã xác thực không đúng',
        });
        return;
      }
      toast({
        title: 'Xác thực thành công',
        description: 'Email của bạn đã được xác thực',
      });
      updateUserInfo({ ...userInfo, VerifiedEmail: '1' });
      setShowVerifyForm(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi xác thực',
      });
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    await handleRequestVerify();
  };

  // If email is verified, only show VerifyStatus
  if (Number(userInfo?.VerifiedEmail) !== 0) {
    return (
      <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
        <VerifyStatus verifyEmail={Number(userInfo?.VerifiedEmail)} />
      </div>
    );
  }

  // Show either VerifyStatus with request button or the verification form
  return (
    <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
      {!showVerifyForm ? (
        <div className="space-y-6">
          <VerifyStatus verifyEmail={Number(userInfo?.VerifiedEmail)} />
          <Card className="w-full border-none shadow-none">
            <CardContent className="pt-6">
              <Button className="w-full" onClick={handleRequestVerify} disabled={isRequestingCode}>
                {isRequestingCode ? 'Đang gửi mã xác thực...' : 'Yêu cầu mã xác thực email'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="w-full border-none shadow-none">
          <CardHeader>
            <CardTitle>Xác nhận Email</CardTitle>
            <CardDescription>
              Vui lòng điền code đã được gửi tới Email của bạn
              {countdown > 0 && ` (đếm ngược: ${formatTime(countdown)})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-8">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="verificationCode">Mã xác thực</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Điền mã xác thực"
                    {...register('verificationCode', {
                      required: 'Mã xác thực là bắt buộc',
                    })}
                  />
                  {errors.verificationCode && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Thất bại</AlertTitle>
                      <AlertDescription>{errors.verificationCode.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleResendCode} disabled={countdown > 0 || isRequestingCode}>
              {isRequestingCode ? 'Đang gửi...' : 'Gửi lại mã xác thực'}
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default VerifyEmailPage;
