import { AlertCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormData = {
  verificationCode: string;
};

const VerifyEmailPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Verification code submitted:', data.verificationCode);
    // Here you would typically send the verification code to your backend
  };

  return (
    <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
      <Card className=" w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Xác nhận Email</CardTitle>
          <CardDescription>Vui lòng điền code đã được gửi tới Email của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-8">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="verificationCode">Mã xác thực</Label>
                <Input
                  id="verificationCode"
                  placeholder="Điền mã xác thực 6 số"
                  {...register('verificationCode', {
                    required: 'Mã xác thực là bắt buộc',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Mã xác thực phải có 6 số',
                    },
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
          <Button variant="outline">Gửi lại mã xác thực</Button>
          <Button onClick={handleSubmit(onSubmit)}>Xác thực</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
