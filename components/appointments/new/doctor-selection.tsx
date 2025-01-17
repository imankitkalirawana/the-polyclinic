'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';

export default function DoctorSelection() {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));

  return (
    <Card className="w-full max-w-sm space-y-4">
      <CardHeader className="flex-col items-start gap-2">
        {step === 2 && (
          <Button
            fullWidth
            color="primary"
            endContent={<Icon icon={'tabler:arrow-right'} />}
            variant="flat"
            onPress={() => setStep(step + 1)}
          >
            Proceed
          </Button>
        )}
        <h3>Select Doctor</h3>
      </CardHeader>
      <CardBody></CardBody>
    </Card>
  );
}
