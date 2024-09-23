import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormData = {
  verificationCode: string;
};

const EmailVerificationFlow: React.FC = () => {
  const [step, setStep] = useState<'check' | 'verify'>('check');
  const [checkStatus, setCheckStatus] = useState<'checking' | 'success' | 'failure'>('checking');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error' | 'timeout'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Simulating the check process
    const checkTimeout = setTimeout(() => {
      // Randomly decide if the check is successful (80% chance of success)
      const isSuccess = Math.random() < 0.8;
      setCheckStatus(isSuccess ? 'success' : 'failure');
    }, 2000);

    return () => clearTimeout(checkTimeout);
  }, []);

  useEffect(() => {
    if (isCodeSent && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setVerificationStatus('timeout');
    }
  }, [isCodeSent, timeLeft]);

  const handleSendCode = () => {
    setIsCodeSent(true);
    setTimeLeft(120);
    setVerificationStatus('idle');
  };

  const onSubmit = (data: FormData) => {
    // Simulating verification process
    if (data.verificationCode === '123456') {
      setVerificationStatus('success');
    } else {
      setVerificationStatus('error');
    }
  };

  if (step === 'check') {
    return (
      <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
        <Card className=" w-full border-none shadow-none">
          <CardHeader className="gap-4">
            <CardTitle>Kiểm tra trạng thái email</CardTitle>
            <CardDescription>Step 1: Trạng thái kích hoạt email</CardDescription>
            <CardDescription>
              <ul className="list-disc">
                <li>
                  Xác thực 2 lớp là chức năng nâng cao bảo mật cho tài khoản, tránh những phiên đăng nhập không mong
                  muốn
                </li>
                <li>
                  Khi xác thực 2 lớp được bật, mỗi lần đăng nhập, đổi mật khẩu hoặc chuyển xu đều cần xác thực 2 lớp.
                </li>
                <li>Để sử dụng tính năng này, người dùng cần xác thực địa chỉ email trước.</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checkStatus === 'checking' && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p>Đang kiểm tra...</p>
              </div>
            )}
            {checkStatus === 'success' && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>Email của bạn đã kích hoạt.</AlertDescription>
              </Alert>
            )}
            {checkStatus === 'failure' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Thất bại</AlertTitle>
                <AlertDescription>Không thể kích hoạt trạng thái email. Vui lòng thử lại.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setStep('verify')} disabled={checkStatus !== 'success'}>
              Tiếp
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
      <Card className=" w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Xác thực 2 lớp</CardTitle>
          <CardDescription>Step 2: Trạng thái kích hoạt xác thực email 2 lớp</CardDescription>
        </CardHeader>
        <CardContent>
          {!isCodeSent ? (
            <Button onClick={handleSendCode} className="w-full">
              Gửi mã xác thực
            </Button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="verificationCode">Xác thực code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter 6-digit code"
                    {...register('verificationCode', {
                      required: 'Xác thực code là bắt buộc',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Phải gồm 6 số.',
                      },
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
              <p className="text-sm text-gray-500 mt-2">
                Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </form>
          )}
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
              <AlertDescription>Mã xác thực đã hết hạn. Vui lòng nhấn yêu cầu gửi lại.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {isCodeSent && <Button onClick={handleSubmit(onSubmit)}>Xác thực</Button>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerificationFlow;
