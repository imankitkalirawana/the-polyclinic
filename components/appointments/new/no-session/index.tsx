import { FormProvider } from './context';
import DetailsInput from './details-input';

export default function NoSession() {
  return (
    <div className="py-4">
      <FormProvider>
        <DetailsInput />
      </FormProvider>
    </div>
  );
}
