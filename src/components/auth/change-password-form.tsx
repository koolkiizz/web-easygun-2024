import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useChangePassword } from '@/hooks/useLogin';
import { ROUTES } from '@/router/constants';
import { Alert, AlertDescription } from '../ui/alert';
import { CardTitle } from '../ui/card';

// Define the form schema
const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

const ChangePasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { changePassword } = useChangePassword();
  const { logout } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        re_new_password: values.confirmNewPassword,
      });

      if (!res) {
        toast({
          title: 'Đổi mật khẩu không thành công! Vui lòng thử lại.',
        });
        return;
      }
      toast({
        title: 'Đổi mật khẩu thành công!',
      });
      logout();
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: 'Đổi mật khẩu không thành công! Vui lòng thử lại.',
      });
    }
  }

  if (isSubmitted) {
    return (
      <Alert>
        <AlertDescription>Mật khẩu đã được cập nhập. Vui lòng đăng nhập lại.</AlertDescription>
        <Button
          onClick={() => {
            navigate(ROUTES.LOGIN);
          }}
        >
          Tới trang đăng nhập
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <CardTitle>Đổi mật khẩu</CardTitle>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Mật khẩu của bạn phải dài hơn 6 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Đổi Mật Khẩu</Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
