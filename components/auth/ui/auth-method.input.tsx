import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AuthMethod } from '../../../services/common/auth/auth.enum';

export default function AuthMethodSelector({
  onChange,
}: {
  onChange: (method: AuthMethod) => void;
}) {
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
        startContent={<Icon icon="devicon:google" width={20} />}
        size="lg"
        data-testid="continue-with-google-btn"
        onPress={() => onChange(AuthMethod.GOOGLE)}
      >
        Continue with Google
      </Button>
    </>
  );
}
