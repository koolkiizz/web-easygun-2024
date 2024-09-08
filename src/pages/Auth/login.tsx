import LoginForm from '@/components/auth/login-form';

const Login = () => {
  console.log('check token');

  return (
    <div className="flex min-w-[500px] max-w-[600px] mx-auto mt-[10vh]">
      <LoginForm />
    </div>
  );
};
export default Login;
