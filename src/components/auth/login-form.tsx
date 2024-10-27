import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLogin, useValidateLogin } from '@/hooks/useLogin';
import { ROUTES } from '@/router/constants';

// Login form schema
const loginFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username phải có ít nhất 2 ký tự.',
  }),
  password: z.string().min(6, {
    message: 'Password phải có ít nhất 5 ký tự.',
  }),
  rememberMe: z.boolean().default(false),
});

// Verification code schema
const verificationFormSchema = z.object({
  verificationCode: z.string().min(6, {
    message: 'Mã xác thực phải có ít nhất 6 ký tự.',
  }),
});

const COUNTDOWN_TIME = 60;

const LoginForm = () => {
  // States
  const [isActived2F, setIsActived2F] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const { login: getToken } = useLogin();
  const { validLogin } = useValidateLogin();

  // Forms
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(ROUTES.HOMEPAGE);
    }
  }, [navigate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle initial login
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      const res = await getToken(values.username, values.password);

      if (!res || (!res && !isActived2F)) {
        setIsActived2F(true);
        setCountdown(COUNTDOWN_TIME);
        toast({
          title: 'Xác thực 2 lớp',
          description: 'Vui lòng kiểm tra email của bạn để lấy mã xác thực',
        });
        return;
      }

      login(res);

      if (Number(res.userInfo?.VerifiedEmail) === 0) {
        navigate(ROUTES.VERIFy_EMAIL);
      } else {
        navigate(ROUTES.HOMEPAGE);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
      });
    }
  }

  // Handle 2FA verification
  const onSubmitCode = async (data: z.infer<typeof verificationFormSchema>) => {
    try {
      if (countdown <= 0) {
        toast({
          variant: 'destructive',
          title: 'Hết hạn',
          description: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.',
        });
        return;
      }

      const res = await validLogin({ code: data.verificationCode });
      if (res) {
        login(res);
        navigate(ROUTES.HOMEPAGE);
      } else {
        toast({
          variant: 'destructive',
          title: 'Thất bại',
          description: 'Mã xác thực không đúng. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Xác thực thất bại. Vui lòng thử lại.',
      });
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setIsRequestingCode(true);
      // Assuming you have a resend code function
      // const response = await resendVerificationCode();
      setCountdown(COUNTDOWN_TIME);
      toast({
        title: 'Đã gửi lại mã',
        description: 'Vui lòng kiểm tra email của bạn',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể gửi lại mã xác thực',
      });
    } finally {
      setIsRequestingCode(false);
    }
  };

  if (isActived2F) {
    return (
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Xác thực 2 lớp</CardTitle>
          <CardDescription>
            Vui lòng điền code đã được gửi tới Email của bạn
            {countdown > 0 && ` (đếm ngược: ${formatTime(countdown)})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(onSubmitCode)} className="space-y-4">
              <FormField
                control={verificationForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác thực</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã xác thực" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResendCode} disabled={countdown > 0 || isRequestingCode}>
            {isRequestingCode ? 'Đang gửi...' : 'Gửi lại mã'}
          </Button>
          <Button
            onClick={verificationForm.handleSubmit(onSubmitCode)}
            disabled={verificationForm.formState.isSubmitting || countdown <= 0}
          >
            {verificationForm.formState.isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <CardTitle>Đăng nhập</CardTitle>
        <FormField
          control={loginForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="easygun" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Nhớ tài khoản</FormLabel>
                <FormDescription>Giữ trạng thái đăng nhập của tài khoản tại thiết bị này.</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
          {loginForm.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </Button>
        <div className="flex justify-between">
          <Button variant="link" type="button">
            <Link to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
          </Button>
          <Button variant="link" type="button">
            <Link to={ROUTES.SIGNUP}>Đăng ký</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
