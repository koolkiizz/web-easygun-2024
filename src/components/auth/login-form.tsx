import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/router/constants';

// Define the form schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
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

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate(ROUTES.HOMEPAGE); // Redirect to dashboard if already logged in
    }
  }, [navigate]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the login request to your backend
    // const hashedPassword = sha256(values.password).toString();

    localStorage.setItem('token', 'token');

    // Redirect to dashboard
    navigate(ROUTES.HOMEPAGE);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
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
              <FormLabel>Password</FormLabel>
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
                <FormLabel>Remember me</FormLabel>
                <FormDescription>Stay logged in on this device</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Log in
        </Button>
        <div className="flex justify-between">
          <Button variant="link" onClick={() => console.log('Forgot password clicked')} type="button">
            <Link to={ROUTES.FORGOT_PASSWORD}> Forgot password?</Link>
          </Button>

          <Button variant="link" onClick={() => console.log('Sign up clicked')} type="button">
            <Link to={ROUTES.SIGNUP}>Sign up</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
