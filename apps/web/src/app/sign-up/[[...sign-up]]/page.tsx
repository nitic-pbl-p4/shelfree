import { SignUp } from '@clerk/nextjs';
import type { FC } from 'react';

const SignUpPage: FC = () => (
  <div className="flex w-full items-center justify-center">
    <SignUp />
  </div>
);

export default SignUpPage;
