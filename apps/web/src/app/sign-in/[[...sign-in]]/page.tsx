import { SignIn } from '@clerk/nextjs';
import type { FC } from 'react';

const SignInPage: FC = () => (
  <div className="flex w-full items-center justify-center">
    <SignIn />
  </div>
);

export default SignInPage;
