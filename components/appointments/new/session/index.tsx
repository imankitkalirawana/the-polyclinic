import { FormProvider } from './context';
import AccordionWrapper from './selection';

export default function Session({ session }: { session?: any }) {
  return (
    <>
      <FormProvider session={session}>
        <AccordionWrapper />
      </FormProvider>
    </>
  );
}
