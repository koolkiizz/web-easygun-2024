import SignUpForm from './../../components/auth/sign-up-form';

const SignUp = () => {
  console.log('check token');

  return (
    <div className="flex min-w-[500px] max-w-[600px] mx-auto mt-[10vh]">
      <SignUpForm />
    </div>
  );
};
export default SignUp;
