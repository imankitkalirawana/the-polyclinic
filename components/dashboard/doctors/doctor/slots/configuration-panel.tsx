'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  cn,
  Input,
  NumberInput,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import type { FormikProps } from 'formik';
import type React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { SpecificDateManager } from './specific-date-manager';
import { getValidEndTimes, getValidStartTimes, timeToMinutes } from './util';
import { SlotConfig, TimeSlot } from '@/services/client/doctor';

const DEFAULT_BUFFER_TIME = 30;
const DEFAULT_MAX_BOOKINGS_PER_DAY = 10;

interface ConfigurationPanelProps {
  formik: FormikProps<SlotConfig>;
}

export function ConfigurationPanel({ formik }: ConfigurationPanelProps) {
  const updateDayEnabled = (day: string, enabled: boolean) => {
    formik.setFieldValue(`availability.schedule.${day}.enabled`, enabled);
  };

  const updateSlotStartTime = (day: string, slotId: string, value: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const slotIndex = daySchedule.slots.findIndex((slot) => slot.id === slotId);

    if (slotIndex === -1) return;

    const currentSlot = daySchedule.slots[slotIndex];
    // Update start time
    formik.setFieldValue(`availability.schedule.${day}.slots.${slotIndex}.start`, value);

    // Auto-adjust end time if it's now invalid
    const startMinutes = timeToMinutes(value);
    const endMinutes = timeToMinutes(currentSlot.end);
    const minEndMinutes = startMinutes + formik.values.duration;

    if (endMinutes < minEndMinutes) {
      // Find the next valid end time
      const validEndTimes = getValidEndTimes(value, getDurationIncrement(), formik.values.duration);
      if (validEndTimes.length > 0) {
        formik.setFieldValue(
          `availability.schedule.${day}.slots.${slotIndex}.end`,
          validEndTimes[0]
        );
      }
    }
  };

  const updateSlotEndTime = (day: string, slotId: string, value: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const slotIndex = daySchedule.slots.findIndex((slot) => slot.id === slotId);

    if (slotIndex === -1) return;
    formik.setFieldValue(`availability.schedule.${day}.slots.${slotIndex}.end`, value);
  };

  const getDurationIncrement = (): number => {
    // Use the smallest increment that divides evenly into the appointment duration
    const { duration } = formik.values;
    if (duration >= 60) return 30;
    if (duration >= 30) return 15;
    return 15; // Default to 15-minute increments
  };

  const getPreviousSlotEndTime = (day: string, currentSlotIndex: number): string | undefined => {
    const daySchedule = formik.values.availability.schedule[day];
    if (currentSlotIndex === 0) return undefined;
    return daySchedule.slots[currentSlotIndex - 1]?.end;
  };

  const addSlot = (day: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const lastSlot = daySchedule.slots[daySchedule.slots.length - 1];
    const durationIncrement = getDurationIncrement();
    const validStartTimes = getValidStartTimes(durationIncrement, lastSlot?.end);

    if (validStartTimes.length === 0) return; // No valid start times available

    const newStartTime = validStartTimes[0];
    const validEndTimes = getValidEndTimes(newStartTime, durationIncrement, formik.values.duration);
    const newEndTime = validEndTimes.length > 0 ? validEndTimes[0] : newStartTime;

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: newStartTime,
      end: newEndTime,
    };

    const updatedSlots = [...daySchedule.slots, newSlot];
    formik.setFieldValue(`availability.schedule.${day}.slots`, updatedSlots);
  };

  const removeSlot = (day: string, slotId: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const updatedSlots = daySchedule.slots.filter((slot) => slot.id !== slotId);

    // Ensure at least one slot remains
    const finalSlots =
      updatedSlots.length > 0 ? updatedSlots : [{ id: '1', start: '09:00', end: '17:00' }];
    formik.setFieldValue(`availability.schedule.${day}.slots`, finalSlots);
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  const durationIncrement = getDurationIncrement();

  const days = [
    { key: 'sunday', label: 'Sun' },
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
  ];

  const durationOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
  ];

  return (
    <div className="relative flex w-[448px] max-w-md flex-col justify-between gap-4 overflow-y-auto overflow-x-hidden border-r border-divider">
      {/* Title */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        <Item>
          <Input
            aria-label="Appointment title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Add title"
            isInvalid={formik.touched.title && !!formik.errors.title}
            errorMessage={formik.touched.title && formik.errors.title}
          />
        </Item>

        {/* Appointment duration */}
        <Item
          title="Appointment duration"
          subtitle="How long should each appointment last?"
          icon="solar:sort-by-time-bold-duotone"
        >
          <Select
            aria-label="Appointment duration"
            name="duration"
            className="max-w-36"
            value={formik.values.duration}
            defaultSelectedKeys={[formik.values.duration?.toString()]}
            items={durationOptions}
            disallowEmptySelection
            onSelectionChange={(value) => {
              const newDuration = Number.parseInt(value.currentKey || '0');
              formik.setFieldValue('duration', newDuration);
            }}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </Item>

        {/* General availability */}
        <Item
          title="General availability"
          subtitle="Set when you're regularly available for appointments"
          icon="solar:clock-circle-bold-duotone"
          className="gap-2"
        >
          <Select
            aria-label="General availability"
            className="max-w-36"
            value="weekly"
            selectedKeys={['weekly']}
            disallowEmptySelection
            disabledKeys={['custom']}
          >
            <SelectItem key="weekly">Repeat weekly</SelectItem>
            <SelectItem key="custom">Custom</SelectItem>
          </Select>
          <div className="flex flex-col items-start gap-2">
            {days.map(({ key, label }) => {
              const dayConfig = formik.values.availability.schedule[key];
              return (
                <div key={key} className="flex w-full gap-2">
                  <div className="w-8 text-sm">{label}</div>
                  <div className="flex w-full flex-1 flex-col gap-2">
                    {dayConfig.slots.map((slot, slotIndex) => {
                      const previousSlotEndTime = getPreviousSlotEndTime(key, slotIndex);
                      const validStartTimes = getValidStartTimes(
                        durationIncrement,
                        previousSlotEndTime
                      );
                      const validEndTimes = getValidEndTimes(
                        slot.start,
                        durationIncrement,
                        formik.values.duration
                      );

                      return (
                        <div key={slot.id} className="grid w-full grid-cols-9 gap-2">
                          {dayConfig.enabled ? (
                            <>
                              <Select
                                aria-label="Start time"
                                className="col-span-3"
                                value={slot.start}
                                defaultSelectedKeys={[slot.start]}
                                onSelectionChange={(value) =>
                                  updateSlotStartTime(key, slot.id, value.currentKey || '')
                                }
                              >
                                {validStartTimes.map((time) => (
                                  <SelectItem key={time}>{time}</SelectItem>
                                ))}
                              </Select>
                              <span className="flex items-center justify-center text-center text-default-500">
                                -
                              </span>
                              <Select
                                aria-label="End time"
                                className="col-span-3"
                                value={slot.end}
                                defaultSelectedKeys={[slot.end]}
                                onSelectionChange={(value) =>
                                  updateSlotEndTime(key, slot.id, value.currentKey || '')
                                }
                              >
                                {validEndTimes.map((time) => (
                                  <SelectItem key={time}>{time}</SelectItem>
                                ))}
                              </Select>
                            </>
                          ) : (
                            <div className="col-span-7 text-default-500">Unavailable</div>
                          )}
                          <div className="col-span-2 flex items-center gap-2">
                            {dayConfig.enabled ? (
                              <Tooltip delay={1000} content="Unavailable all day">
                                <Button
                                  isIconOnly
                                  type="button"
                                  variant="light"
                                  size="sm"
                                  onPress={() => {
                                    if (dayConfig.slots.length === 1) {
                                      updateDayEnabled(key, false);
                                    } else {
                                      removeSlot(key, slot.id);
                                    }
                                  }}
                                  radius="full"
                                >
                                  <Icon icon="solar:forbidden-circle-outline" width={20} />
                                </Button>
                              </Tooltip>
                            ) : (
                              <div className="col-span-1 aspect-square h-full">&nbsp;</div>
                            )}
                            {slotIndex === 0 && (
                              <Tooltip delay={1000} content="Add another period for this day">
                                <Button
                                  type="button"
                                  variant="light"
                                  size="sm"
                                  onPress={() => {
                                    if (dayConfig.enabled) {
                                      addSlot(key);
                                    } else {
                                      updateDayEnabled(key, true);
                                    }
                                  }}
                                  isDisabled={
                                    getValidStartTimes(
                                      durationIncrement,
                                      dayConfig.slots[dayConfig.slots.length - 1]?.end
                                    ).length === 0
                                  }
                                  isIconOnly
                                  radius="full"
                                >
                                  <Icon icon="solar:add-circle-linear" width={20} />
                                </Button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Item>

        {/* Adjusted availability */}
        <Item
          title="Adjusted availability"
          subtitle="Set when you're available for specific dates"
          icon="iconamoon:history-duotone"
        >
          <SpecificDateManager formik={formik} />
        </Item>

        {/* Booked appointment settings */}
        <Accordion
          selectionMode="multiple"
          itemClasses={{
            subtitle: 'text-default-500',
          }}
        >
          {/* Booked Appointment Settings */}
          <AccordionItem
            key="bookedSettings"
            title="Booked appointment settings"
            subtitle={`${
              formik.values.bufferTime > 0
                ? `${formik.values.bufferTime} minutes buffer`
                : 'No buffer time'
            } · ${
              formik.values.maxBookingsPerDay
                ? `${formik.values.maxBookingsPerDay} max bookings`
                : 'No maximum bookings'
            } per day · Guest permissions`}
            startContent={<ItemIcon icon="solar:settings-minimalistic-bold-duotone" />}
            classNames={{
              subtitle: 'text-default-500 text-tiny',
              trigger: 'gap-1 items-start',
            }}
          >
            <div className="ml-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <h3 className="font-medium text-small">Buffer time</h3>
                  <p className="text-default-500 text-tiny">Add time between appointment slots</p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    name="bufferTime"
                    isSelected={formik.values.bufferTime > 0}
                    onChange={(e) => {
                      formik.setFieldValue('bufferTime', e.target.checked ? 30 : 0);
                    }}
                  />
                  <NumberInput
                    aria-label="Buffer time"
                    hideStepper
                    size="sm"
                    className="max-w-36"
                    value={formik.values.bufferTime}
                    onValueChange={(value) => formik.setFieldValue('bufferTime', Number(value))}
                    defaultValue={DEFAULT_BUFFER_TIME}
                    minValue={1}
                    maxValue={60}
                    isDisabled={formik.values.bufferTime === 0}
                    endContent={<span className="text-default-500">Minutes</span>}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <h3 className="font-medium text-small">Maximum bookings per day</h3>
                  <p className="text-default-500 text-tiny">
                    Limit how many booked appointments to accept in a single day
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    aria-label="Maximum bookings per day"
                    name="maxBookingsPerDay"
                    isSelected={formik.values.maxBookingsPerDay !== null}
                    onValueChange={(value) => {
                      formik.setFieldValue(
                        'maxBookingsPerDay',
                        value.valueOf() ? DEFAULT_MAX_BOOKINGS_PER_DAY : null
                      );
                    }}
                  />
                  <NumberInput
                    aria-label="Maximum bookings per day"
                    hideStepper
                    size="sm"
                    className="max-w-28"
                    value={formik.values.maxBookingsPerDay || DEFAULT_MAX_BOOKINGS_PER_DAY}
                    onValueChange={(value) =>
                      formik.setFieldValue('maxBookingsPerDay', Number(value))
                    }
                    isDisabled={formik.values.maxBookingsPerDay === null}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-small">Guest permissions</h3>
                <div className="flex items-center gap-2">
                  <Checkbox
                    aria-label="Guest permissions"
                    name="guestPermissions.canInviteOthers"
                    isSelected={formik.values.guestPermissions.canInviteOthers}
                    onChange={formik.handleChange}
                  />
                  <div>
                    <div className="font-medium text-small">Guests can invite others</div>
                    <div className="text-default-500 text-tiny">
                      After booking an appointment guests can modify the calendar event to invite
                      others
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Save button */}
      <div className="flex justify-end border-t border-divider px-4 pt-2">
        <Button onPress={handleSave} isLoading={formik.isSubmitting} color="primary" radius="full">
          Save
        </Button>
      </div>
    </div>
  );
}

function Title({ title }: { title: string }) {
  return <h3>{title}</h3>;
}

function Subtitle({ subtitle }: { subtitle: string }) {
  return <p className="text-default-500 text-tiny">{subtitle}</p>;
}

function ItemIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 rounded-small p-1 text-default-500', className)}>
      <Icon icon={icon} width={20} />
    </div>
  );
}

function Item({
  title,
  subtitle,
  icon,
  children,
  className,
  isBorder = true,
}: {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  isBorder?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-1">
        {icon ? <ItemIcon icon={icon} /> : <div className="w-8" />}
        <div>
          {title && <Title title={title} />}
          {subtitle && <Subtitle subtitle={subtitle} />}
        </div>
      </div>
      <div
        className={cn(
          'ml-8 flex flex-col',
          {
            'border-b border-divider pb-4': isBorder,
          },
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
