import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useChangeEmail, useValidChangeEmail } from '@/hooks/useEmail';

// Form schemas
const emailFormSchema = z.object({
  email: z
    .string({
      required_error: 'Email là bắt buộc',
    })
    .email('Email không hợp lệ'),
});

const verificationFormSchema = z.object({
  code: z.string().min(6, 'Mã xác thực phải có ít nhất 6 ký tự'),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

const ChangeEmailPage: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Hooks
  const { userInfo } = useAuth();
  const { changeEmail, isLoading: isChanging } = useChangeEmail();
  const { validChangeEmail, isLoading: isValidating } = useValidChangeEmail();

  // Forms
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: '',
    },
  });

  // Add countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Add resend handler
  const handleResendCode = async () => {
    try {
      setCanResend(false);
      const response = await changeEmail({ email: emailForm.getValues('email') });
      if (!response) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể gửi lại mã xác thực',
        });
        setCanResend(true);
        return;
      }
      setCountdown(60);
      toast({
        title: 'Thành công',
        description: 'Mã xác thực mới đã được gửi',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
      setCanResend(true);
    }
  };

  const onEmailSubmit = async (values: EmailFormValues) => {
    try {
      const response = await changeEmail({ email: values.email });
      if (!response) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Đã có lỗi xảy ra',
        });
        return;
      }
      setCountdown(60); // Add this line
      setCanResend(false); // Add this line
      setStep('verify');
      toast({
        title: 'Thành công',
        description: 'Vui lòng kiểm tra email để lấy mã xác thực',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    }
  };

  const onVerificationSubmit = async (values: VerificationFormValues) => {
    try {
      const response = await validChangeEmail({ code: values.code });

      if (!response) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Đã có lỗi xảy ra',
        });
        return;
      }
      toast({
        title: 'Thành công',
        description: 'Email đã được thay đổi thành công',
      });

      // Reset forms and state
      emailForm.reset();
      verificationForm.reset();
      setStep('email');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    }
  };

  if (step === 'verify') {
    return (
      <div className="container mx-auto max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Xác thực thay đổi email</CardTitle>
            <CardDescription className="space-y-2">
              <p>Vui lòng nhập mã xác thực đã được gửi đến email: {userInfo?.Email}</p>
              {countdown > 0 && (
                <p className="text-sm text-muted-foreground">Mã xác thực còn hiệu lực trong: {countdown}s</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} id="valid-email">
                <div className="space-y-6">
                  <FormField
                    control={verificationForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã xác thực</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="Nhập mã xác thực" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between gap-3">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep('email');
                          verificationForm.reset();
                        }}
                      >
                        Quay lại
                      </Button>
                      {canResend && (
                        <Button type="button" variant="outline" onClick={handleResendCode}>
                          Gửi lại mã
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      form="valid-email"
                      disabled={isValidating || !verificationForm.formState.isValid}
                    >
                      {isValidating ? 'Đang xác thực...' : 'Xác thực'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Thay đổi email</CardTitle>
          <CardDescription>Nhập địa chỉ email mới của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6" id="request-change-email">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email mới</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập địa chỉ email mới" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" form="request-change-email" className="w-full" disabled={isChanging}>
                {isChanging ? 'Đang xử lý...' : 'Tiếp tục'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeEmailPage;
