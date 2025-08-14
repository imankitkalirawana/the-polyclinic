import React, { useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Icon } from '@iconify/react/dist/iconify.js';

import { APPOINTMENT_BUTTON_CONFIGS, isButtonVisible } from '../config/appointments';

import { useAppointmentStore } from '@/store/appointment';
import { AppointmentType, ProcessedButton } from '@/types/appointment';
import { UserType } from '@/types/user';

const useAppointmentButtonsInDrawer = ({
  selected,
  role,
}: {
  selected: AppointmentType | null;
  role: UserType['role'];
}) => {
  const { setAction } = useAppointmentStore();
  const router = useRouter();

  return useMemo(
    () =>
      APPOINTMENT_BUTTON_CONFIGS.filter((config) => isButtonVisible(config, selected, role)).map(
        (config): ProcessedButton => {
          const isVisible = isButtonVisible(config, selected, role);

          const handlePress = async () => {
            if (!selected) return;

            switch (config.action.type) {
              case 'store-action':
                setAction(config.action.payload);
                break;
              case 'async-function':
                if (config.action.handler) {
                  await config.action.handler(selected);
                }
                break;
              case 'navigation':
                if (config.action.url) {
                  router.push(config.action.url(selected));
                }
                break;
            }
          };

          return {
            key: config.key,
            children: config.label,
            startContent: <Icon icon={config.icon} width="20" />,
            color: config.color,
            variant: config.variant,
            position: config.position,
            isIconOnly: config.isIconOnly,
            whileLoading: config.whileLoading,
            isHidden: !isVisible,
            onPress: handlePress,
            content:
              config.content && selected ? (
                <config.content appointment={selected} onClose={() => setAction(null)} />
              ) : undefined,
          };
        }
      ),
    [selected, role, setAction, router]
  );
};

export default useAppointmentButtonsInDrawer;
