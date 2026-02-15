'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

import { GOOGLE_CLIENT_ID } from '@/libs/config';

import { AuthMethod } from '@/services/common/auth/auth.enum';

export interface AuthMethodSelectorProps {
  onChange: (method: AuthMethod) => void;
  /** When provided and Google is configured, Google sign-in is shown and credential is sent here. */
  onGoogleSuccess?: (credential: string) => void;
  onGoogleError?: () => void;
}

export default function AuthMethodSelector({
  onChange,
  onGoogleSuccess,
  onGoogleError,
}: AuthMethodSelectorProps) {
  const showGoogleLogin = Boolean(GOOGLE_CLIENT_ID) && typeof onGoogleSuccess === 'function';
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: (response: TokenResponse) => {
      if (response.access_token) {
        onGoogleSuccess?.(response.access_token);
      }
    },
    onError: () => {
      onGoogleError?.();
    },
  });

  return (
    <>
      <Button
        fullWidth
        variant="flat"
        startContent={<Icon icon="solar:phone-bold-duotone" width={20} />}
        size="lg"
        color="primary"
        data-testid="continue-with-phone-btn"
        onPress={() => onChange(AuthMethod.PHONE)}
      >
        Continue with Phone
      </Button>
      <Button
        fullWidth
        variant="bordered"
        startContent={<Icon icon="solar:letter-bold-duotone" width={20} />}
        size="lg"
        color="primary"
        data-testid="continue-with-email-btn"
        onPress={() => onChange(AuthMethod.EMAIL)}
      >
        Continue with Email
      </Button>
      <Button
        fullWidth
        variant="bordered"
        startContent={<Icon icon="material-icon-theme:google" width={20} />}
        size="lg"
        data-testid="continue-with-google-btn"
        onPress={() => googleLogin()}
        isDisabled={!showGoogleLogin}
      >
        Continue with Google
      </Button>
    </>
  );
}
