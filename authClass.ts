import { CredentialsSignin } from 'next-auth';
export class InvalidCredentialsError extends CredentialsSignin {
  code = 'Invalid Username/Password';
  message = 'Invalid credentials';
}

export class sd extends CredentialsSignin {}
