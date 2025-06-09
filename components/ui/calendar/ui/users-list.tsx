import { useLinkedUsers } from '@/store/user';
import { Card, CardBody, cn, Image, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function UsersList({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const { data: linkedUsers, isLoading } = useLinkedUsers();

  if (!linkedUsers) return null;

  return (
    <div className="mt-8 flex gap-4">
      <Card
        isPressable
        className={cn(
          'no-scrollbar min-w-64 rounded-medium border-small border-divider shadow-none sm:min-w-72'
        )}
      >
        <CardBody className="items-center gap-4 p-8">
          <div>
            <Icon
              icon="solar:add-circle-line-duotone"
              width={80}
              height={80}
              className="text-default-500"
            />
          </div>
          <div>
            <h2 className="text-center text-large font-semibold text-primary">
              Register New Patient
            </h2>
            <p className="text-small font-light text-default-500">
              Add a new patient to your list
            </p>
          </div>
        </CardBody>
      </Card>
      <ScrollShadow orientation="horizontal" className="flex gap-4">
        {linkedUsers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) => (
            <Card
              isPressable
              key={user.uid}
              className={cn(
                'no-scrollbar min-w-64 rounded-medium border-small border-divider shadow-none sm:min-w-72',
                {
                  'border-medium border-primary-400': true,
                  // user.uid === formik.values.patient?.uid,
                }
              )}
              //   onPress={() => {
              //     formik.setFieldValue('patient', user);
              //   }}
            >
              <CardBody className="items-center gap-4 p-6">
                <div>
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="rounded-full bg-slate-300"
                  />
                </div>
                <div>
                  <h2 className="text-center text-large font-semibold">
                    {user.name}
                  </h2>
                  <p className="text-small font-light text-default-500">
                    {user.email}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
      </ScrollShadow>
    </div>
  );
}
