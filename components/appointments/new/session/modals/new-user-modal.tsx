'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Divider,
  Chip,
  Image,
  Link,
  Input,
  ScrollShadow,
  Select,
  SelectItem
} from '@heroui/react';
import { useForm } from '../context';
import { Icon } from '@iconify/react/dist/iconify.js';
import VerifyId from './verify-id';

export default function NewUserModal() {
  const { formik, register, session } = useForm();

  const ModalMap: Record<number, React.ReactNode> = {
    2: <VerifyId />,
    4: <>Step 3</>
  };

  return (
    <>
      <Modal
        isOpen
        isDismissable={false}
        backdrop="blur"
        hideCloseButton={session.user?.role === 'user'}
        isKeyboardDismissDisabled
        scrollBehavior="inside"
        onClose={() => {
          register.resetForm();
        }}
      >
        <ModalContent className="px-4">
          <>
            <ModalHeader className="flex-col items-center justify-center gap-2">
              <div className="flex w-fit rounded-full bg-default-100 p-4">
                <Icon icon="solar:user-bold" width="36" />
              </div>
              <h3>Register New Patient</h3>
              <p className="text-center text-xs font-light text-default-500">
                Please enter details to continue appointment
              </p>
            </ModalHeader>
            <ModalBody className="px-0">
              <ScrollShadow className="grid grid-cols-6 gap-2 gap-y-4 p-2">
                <Input
                  label="First Name"
                  value={register.values.firstName}
                  name="firstName"
                  onChange={register.handleChange}
                  className="col-span-3"
                  isInvalid={
                    register.touched.firstName && register.errors.firstName
                      ? true
                      : false
                  }
                  errorMessage={
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:info-circle-bold" width="14" />
                      <span>{register.errors.firstName}</span>
                    </div>
                  }
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={register.values.lastName}
                  onChange={register.handleChange}
                  className="col-span-3"
                />
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={
                    register.values.age !== undefined
                      ? String(register.values.age)
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || !isNaN(Number(value))) {
                      register.setFieldValue(
                        'age',
                        value === '' ? '' : Number(value)
                      );
                    }
                  }}
                  max={120}
                  className="col-span-3"
                  isInvalid={
                    register.touched.age && register.errors.age ? true : false
                  }
                  errorMessage={
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:info-circle-bold" width="14" />
                      <span>{register.errors.age}</span>
                    </div>
                  }
                />
                <Select
                  aria-label="Gender"
                  label="Gender"
                  className="col-span-3"
                  selectedKeys={[register.values.gender]}
                  name="gender"
                  onChange={register.handleChange}
                  isInvalid={
                    register.touched.gender && register.errors.gender
                      ? true
                      : false
                  }
                  errorMessage={
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:info-circle-bold" width="14" />
                      <span>{register.errors.gender}</span>
                    </div>
                  }
                >
                  <SelectItem color="success" key="male">
                    Male
                  </SelectItem>
                  <SelectItem color="danger" key="female">
                    Female
                  </SelectItem>
                  <SelectItem color="warning" key="other">
                    Other
                  </SelectItem>
                </Select>

                <Input
                  label="Email / Phone"
                  name="id"
                  isReadOnly={register.values.step > 1}
                  value={register.values.id}
                  onChange={register.handleChange}
                  className="col-span-full"
                  startContent={
                    register.values.id.length > 3 &&
                    !isNaN(Number(register.values.id)) ? (
                      <select
                        className="border-0 bg-transparent text-small text-default-400 outline-none"
                        id="countryCode"
                        name="countryCode"
                        value={'+91'}
                      >
                        <option value="+91">+91</option>
                      </select>
                    ) : null
                  }
                  isInvalid={
                    register.touched.id && register.errors.id ? true : false
                  }
                  errorMessage={
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:info-circle-bold" width="14" />
                      <span>{register.errors.id}</span>
                    </div>
                  }
                  description={
                    register.values.step > 2 && (
                      <>
                        <Link
                          href="#"
                          onPress={() => {
                            register.setValues({
                              ...register.values,
                              step: 1,
                              otp: ''
                            });
                          }}
                          className="text-xs"
                        >
                          Change
                        </Link>
                      </>
                    )
                  }
                />
                <Divider className="col-span-full my-2 border-dashed border-divider" />
              </ScrollShadow>
            </ModalBody>
            <ModalFooter className="flex-col-reverse px-0 sm:flex-row">
              <Button
                fullWidth
                variant="flat"
                onPress={() => {
                  formik.setValues({ ...formik.values, step: 1 });
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                color="primary"
                endContent={<Icon icon="tabler:chevron-right" width={18} />}
                onPress={() => register.handleSubmit()}
                isLoading={register.isSubmitting}
              >
                Continue
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      {ModalMap[register.values.step]}
    </>
  );
}
