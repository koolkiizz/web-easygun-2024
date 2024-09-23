import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define the form schema
const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the request to your backend
    // For this example, we'll just set a state to show a success message
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <Alert>
        <AlertDescription>
          Nếu tài khoản của bạn đăng ký địa chỉ email: {form.getValues().email}, bạn sẽ nhận được mật khẩu tại địa chỉ
          này.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormDescription>Nhập Email đã được đăng ký tài khoản</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Đặt Lại Mật Khẩu</Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
