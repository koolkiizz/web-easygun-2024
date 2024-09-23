import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormData = {
  currentEmail: string;
  newEmail: string;
  password: string;
};

const ChangeEmailPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
    // For this example, we'll simulate a successful email change
    setIsSuccess(true);
  };

  return (
    <div className="min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Đổi địa chỉ email</CardTitle>
          <CardDescription>Cập nhập địa chỉ email mới của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-8">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currentEmail">Email hiện tại</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  placeholder="your.current@email.com"
                  {...register('currentEmail', {
                    required: 'Email hiện tại là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Không đúng cú pháp của email',
                    },
                  })}
                />
                {errors.currentEmail && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.currentEmail.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="newEmail">Email mới</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="your.new@email.com"
                  {...register('newEmail', {
                    required: 'Email mới là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Không đúng cú pháp của email',
                    },
                  })}
                />
                {errors.newEmail && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.newEmail.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" {...register('password', { required: 'Mật khẩu là bắt buộc' })} />
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.password.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Hủy
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Đổi Email</Button>
        </CardFooter>
        {isSuccess && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Bạn đã cập nhập Email thành công. Vui lòng kiểm tra lại Email mới này.</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default ChangeEmailPage;
