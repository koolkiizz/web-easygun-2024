import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useLogin } from '@/hooks/useLogin';
import { ROUTES } from '@/router/constants';
import { CardTitle } from '../ui/card';

// Define the form schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username phải có ít nhất 2 ký tự.',
  }),
  password: z.string().min(6, {
    message: 'Password phải có ít nhất 5 ký tự.',
  }),
  rememberMe: z.boolean().default(false),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { login: getToken } = useLogin();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(ROUTES.HOMEPAGE); // Redirect to dashboard if already logged in
    }
  }, [navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await getToken(values.username, values.password);
      if (!res) {
        return;
      }
      login(res);
      // Redirect to homepage

      if (Number(res.userInfo?.VerifiedEmail) === 0) {
        navigate(ROUTES.VERIFy_EMAIL);
      } else {
        navigate(ROUTES.HOMEPAGE);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <CardTitle>Đăng nhập</CardTitle>
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
        <Button type="submit" className="w-full">
          Đăng Nhập
        </Button>
        <div className="flex justify-between">
          <Button variant="link" onClick={() => console.log('Forgot password clicked')} type="button">
            <Link to={ROUTES.FORGOT_PASSWORD}> Quên mật khẩu?</Link>
          </Button>

          <Button variant="link" onClick={() => console.log('Sign up clicked')} type="button">
            <Link to={ROUTES.SIGNUP}>Đăng ký</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
