import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CenterLayout } from '../components/layouts/CenterLayout'
import { LoginForm } from '../components/LoginForm';
import { useState } from 'react';
import { RegisterForm } from '../components/RegisterForm';

export enum FormType {
  LOGIN = 'login',
  REGISTER = 'register',
}

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return <CenterLayout>
    <LoginPage>
      <Outlet />
    </LoginPage>
  </CenterLayout>
}

function LoginPage({ children }: { children?: React.ReactNode }) {
  const [formType, setFormType] = useState<FormType>(FormType.LOGIN);

  switch (formType) {
    case FormType.LOGIN:
      return <LoginForm handleFormChange={setFormType} />;
    case FormType.REGISTER:
      return <RegisterForm handleFormChange={setFormType} />;
    default:
      throw new Error(`Form type ${formType} is not supported`);
  }
}