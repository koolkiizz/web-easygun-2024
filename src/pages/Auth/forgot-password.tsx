import ForgotPasswordForm from './../../components/auth/forgot-password-form';

const ForgotPasswordPage = () => {
  console.log('check token');

  return (
    <div className="flex min-w-[500px] max-w-[600px] mx-auto mt-[10vh]">
      <ForgotPasswordForm />
    </div>
  );
};
export default ForgotPasswordPage;
