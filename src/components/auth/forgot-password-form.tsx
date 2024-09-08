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
          If an account exists for {form.getValues().email}, you will receive password reset instructions.
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
              <FormDescription>Enter the email address associated with your account.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
