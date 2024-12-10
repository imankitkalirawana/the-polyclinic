import { type AriaButtonProps, useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import type { CalendarState } from '@react-stately/calendar';
import { useRef } from 'react';
import { Button as NextButton } from '@nextui-org/react';

export function Button(
  props: AriaButtonProps<'button'> & {
    state?: CalendarState;
    side?: 'left' | 'right';
  }
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    // @ts-ignore
    <NextButton
      {...mergeProps(buttonProps)}
      isIconOnly
      radius="full"
      variant="light"
      ref={ref}
      isDisabled={props.isDisabled}
    >
      {props.children}
    </NextButton>
  );
}
