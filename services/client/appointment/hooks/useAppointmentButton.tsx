import React, { useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useAppointmentButtonConfigs, isButtonVisible } from '../appointment.config';

import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentType, ProcessedButton } from '@/services/client/appointment';
import { Role } from '@/services/common/user/user.constants';

const useAppointmentButtonsInDrawer = ({
  selected,
  role,
}: {
  selected: AppointmentType | null;
  role: Role;
}) => {
  const { setAction } = useAppointmentStore();
  const router = useRouter();
  const buttonConfigs = useAppointmentButtonConfigs();

  return useMemo(
    () =>
      buttonConfigs
        .filter((config) => isButtonVisible(config, selected, role))
        .map((config): ProcessedButton => {
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
        }),
    [selected, role, setAction, router, buttonConfigs]
  );
};

export default useAppointmentButtonsInDrawer;
