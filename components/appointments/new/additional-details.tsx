import { Input, Textarea } from "@heroui/react";

export default function AdditionalDetails() {
  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <Input
            label="Symptoms"
            placeholder="eg. fever, cough, headache"
            classNames={{
              input: 'placeholder:text-default-500'
            }}
          />
        </div>
        <div>
          <Textarea
            label="Addional Notes"
            placeholder="eg. patient is allergic to penicillin"
            classNames={{
              input: 'placeholder:text-default-500'
            }}
          />
        </div>
      </div>
    </>
  );
}
