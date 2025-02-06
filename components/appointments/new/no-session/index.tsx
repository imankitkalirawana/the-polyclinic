import DetailsInput from './details-input';
import { FormProvider } from './context';

export default function NoSession() {
  return (
    <div className="py-4">
      <FormProvider>
        <DetailsInput />
      </FormProvider>
    </div>
  );
}
