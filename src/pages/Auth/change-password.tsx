import ChangePasswordForm from '@/components/auth/change-password-form';

const ChangePasswordPage = () => {
  console.log('check token');

  return (
    <div className="flex min-w-[500px] max-w-[600px] mx-auto mt-[10vh] bg-white rounded-lg p-6">
      <ChangePasswordForm />
    </div>
  );
};
export default ChangePasswordPage;
