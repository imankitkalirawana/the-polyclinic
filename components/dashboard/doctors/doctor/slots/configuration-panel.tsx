'use client';

import { useState } from 'react';

import type { AppointmentConfig, TimeSlot } from './types';
import {
  Button,
  Checkbox,
  Input,
  NumberInput,
  Select,
  SelectItem,
  TimeInput,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { FormikProps } from 'formik';
import { getValidEndTimes, getValidStartTimes, timeToMinutes } from './util';

import {
  parseAbsoluteToLocal,
  Time,
  ZonedDateTime,
} from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';

interface ConfigurationPanelProps {
  formik: FormikProps<AppointmentConfig>;
}

export function ConfigurationPanel({ formik }: ConfigurationPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    schedulingWindow: false,
    adjustedAvailability: false,
    bookedSettings: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateDayEnabled = (day: string, enabled: boolean) => {
    formik.setFieldValue(`availability.schedule.${day}.enabled`, enabled);
  };

  const updateSlotStartTime = (day: string, slotId: string, value: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const slotIndex = daySchedule.slots.findIndex((slot) => slot.id === slotId);

    if (slotIndex === -1) return;

    const currentSlot = daySchedule.slots[slotIndex];
    // Update start time
    formik.setFieldValue(
      `availability.schedule.${day}.slots.${slotIndex}.start`,
      value
    );

    // Auto-adjust end time if it's now invalid
    const startMinutes = timeToMinutes(value);
    const endMinutes = timeToMinutes(currentSlot.end);
    const minEndMinutes = startMinutes + formik.values.duration;

    if (endMinutes < minEndMinutes) {
      // Find the next valid end time
      const validEndTimes = getValidEndTimes(
        value,
        getDurationIncrement(),
        formik.values.duration
      );
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
    formik.setFieldValue(
      `availability.schedule.${day}.slots.${slotIndex}.end`,
      value
    );
  };

  const getDurationIncrement = (): number => {
    // Use the smallest increment that divides evenly into the appointment duration
    const duration = formik.values.duration;
    if (duration >= 60) return 30;
    if (duration >= 30) return 15;
    return 15; // Default to 15-minute increments
  };

  const getPreviousSlotEndTime = (
    day: string,
    currentSlotIndex: number
  ): string | undefined => {
    const daySchedule = formik.values.availability.schedule[day];
    if (currentSlotIndex === 0) return undefined;
    return daySchedule.slots[currentSlotIndex - 1]?.end;
  };

  const addSlot = (day: string) => {
    const daySchedule = formik.values.availability.schedule[day];
    const lastSlot = daySchedule.slots[daySchedule.slots.length - 1];
    const durationIncrement = getDurationIncrement();
    const validStartTimes = getValidStartTimes(
      durationIncrement,
      lastSlot?.end,
      formik.values.duration
    );

    if (validStartTimes.length === 0) return; // No valid start times available

    const newStartTime = validStartTimes[0];
    const validEndTimes = getValidEndTimes(
      newStartTime,
      durationIncrement,
      formik.values.duration
    );
    const newEndTime =
      validEndTimes.length > 0 ? validEndTimes[0] : newStartTime;

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
      updatedSlots.length > 0
        ? updatedSlots
        : [{ id: '1', start: '09:00', end: '17:00' }];
    formik.setFieldValue(`availability.schedule.${day}.slots`, finalSlots);
  };

  const handleNextClick = () => {
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
    <div className="w-96 overflow-y-auto border-r p-4 pl-0">
      <div>
        <Input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Add title"
          isInvalid={formik.touched.title && !!formik.errors.title}
          errorMessage={formik.touched.title && formik.errors.title}
        />
      </div>

      {/* Appointment Duration */}
      <div className="border-b">
        <div className="mb-2 flex items-center gap-2">
          <Icon icon="mdi:clock" className="h-4 w-4" />
          <h3 className="font-medium">Appointment duration</h3>
        </div>
        <Select
          label="How long should each appointment last?"
          name="duration"
          value={formik.values.duration}
          defaultSelectedKeys={[formik.values.duration.toString()]}
          items={durationOptions}
          disallowEmptySelection
          onSelectionChange={(value) => {
            const newDuration = Number.parseInt(value.currentKey || '0');
            formik.setFieldValue('duration', newDuration);

            // Reset all time slots to valid values when duration changes
            const newIncrement = newDuration >= 60 ? 30 : 15;
            const defaultStart = '09:00';
            const defaultEndMinutes = timeToMinutes(defaultStart) + newDuration;
            const defaultEnd = `${Math.floor(defaultEndMinutes / 60)
              .toString()
              .padStart(
                2,
                '0'
              )}:${(defaultEndMinutes % 60).toString().padStart(2, '0')}`;

            days.forEach(({ key }) => {
              const daySchedule = formik.values.availability.schedule[key];
              if (daySchedule.enabled) {
                formik.setFieldValue(`availability.schedule.${key}.slots`, [
                  { id: '1', start: defaultStart, end: defaultEnd },
                ]);
              }
            });
          }}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
      </div>

      {/* General Availability */}
      <div className="border-b">
        <div className="mb-2 flex items-center gap-2">
          <Icon icon="mdi:clock" className="h-4 w-4" />
          <h3 className="font-medium">General availability</h3>
        </div>
        <p className="mb-4 text-sm">
          Set when you're regularly available for appointments.{' '}
          <span className="cursor-pointer text-primary-400">Learn more</span>
        </p>

        <Select value="weekly" selectedKeys={['weekly']}>
          <SelectItem key="weekly">Repeat weekly</SelectItem>
        </Select>

        <div className="space-y-4">
          {days.map(({ key, label }) => {
            const dayConfig = formik.values.availability.schedule[key];
            return (
              <div key={key} className="flex items-start gap-2">
                <div className="flex w-8 items-start gap-3">
                  <div className="text-sm">{label}</div>
                  {dayConfig.enabled ? (
                    <div className="flex flex-1 items-center gap-2"></div>
                  ) : (
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-sm">Unavailable</span>
                      <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        radius="full"
                        onPress={() => updateDayEnabled(key, true)}
                        type="button"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>

                {dayConfig.enabled && (
                  <div className="flex flex-1 items-start gap-2">
                    <div className="flex w-full flex-col gap-1">
                      {dayConfig.slots.map((slot, slotIndex) => {
                        const previousSlotEndTime = getPreviousSlotEndTime(
                          key,
                          slotIndex
                        );
                        const validStartTimes = getValidStartTimes(
                          durationIncrement,
                          previousSlotEndTime,
                          formik.values.duration
                        );
                        const validEndTimes = getValidEndTimes(
                          slot.start,
                          durationIncrement,
                          formik.values.duration
                        );

                        return (
                          <div
                            key={slot.id}
                            className="flex w-full items-center gap-2"
                          >
                            <Select
                              value={slot.start}
                              defaultSelectedKeys={[slot.start]}
                              onSelectionChange={(value) =>
                                updateSlotStartTime(
                                  key,
                                  slot.id,
                                  value.currentKey || ''
                                )
                              }
                            >
                              {validStartTimes.map((time) => (
                                <SelectItem key={time}>{time}</SelectItem>
                              ))}
                            </Select>

                            <span className="text-gray-400">-</span>

                            <Select
                              value={slot.end}
                              defaultSelectedKeys={[slot.end]}
                              onSelectionChange={(value) =>
                                updateSlotEndTime(
                                  key,
                                  slot.id,
                                  value.currentKey || ''
                                )
                              }
                            >
                              {validEndTimes.map((time) => (
                                <SelectItem key={time}>{time}</SelectItem>
                              ))}
                            </Select>

                            {dayConfig.slots.length > 1 && (
                              <Button
                                isIconOnly
                                type="button"
                                variant="flat"
                                size="sm"
                                color="danger"
                                onPress={() => removeSlot(key, slot.id)}
                              >
                                <Icon
                                  icon="mdi:trash-can"
                                  className="h-3 w-3"
                                />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      variant="flat"
                      size="sm"
                      onPress={() => addSlot(key)}
                      isDisabled={
                        getValidStartTimes(
                          durationIncrement,
                          dayConfig.slots[dayConfig.slots.length - 1]?.end,
                          formik.values.duration
                        ).length === 0
                      }
                      isIconOnly
                    >
                      <Icon icon="mdi:plus" className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduling Window */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('schedulingWindow')}
          className="hover:bg-gray-750 flex w-full items-center justify-between p-6"
        >
          <div className="flex items-center gap-2">
            <Icon icon="mdi:calendar" className="h-4 w-4" />
            <div className="text-left">
              <h3 className="font-medium">Scheduling window</h3>
              <div className="text-sm">
                Limit the time range that appointments can be booked
              </div>
            </div>
          </div>
          {expandedSections.schedulingWindow ? (
            <Icon icon="mdi:chevron-up" className="h-4 w-4" />
          ) : (
            <Icon icon="mdi:chevron-down" className="h-4 w-4" />
          )}
        </button>

        {expandedSections.schedulingWindow && (
          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="available_now"
                  name="scheduling_window"
                  checked={
                    formik.values.schedulingWindow.type === 'available_now'
                  }
                  onChange={() =>
                    formik.setFieldValue(
                      'schedulingWindow.type',
                      'available_now'
                    )
                  }
                  className="text-blue-500"
                />
                <h3>Available now</h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="date_range"
                  name="scheduling_window"
                  checked={formik.values.schedulingWindow.type === 'date_range'}
                  onChange={() =>
                    formik.setFieldValue('schedulingWindow.type', 'date_range')
                  }
                  className="text-blue-500"
                />
                <h3>Start and end dates</h3>
              </div>
              <p className="ml-6 text-sm">
                Limit the date range for all appointments
              </p>
            </div>

            <div>
              <h3 className="text-sm">
                Maximum time in advance that an appointment can be booked
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Checkbox
                  checked={
                    formik.values.schedulingWindow.maxAdvanceDays !== null
                  }
                  onValueChange={(checked) =>
                    formik.setFieldValue(
                      'schedulingWindow.maxAdvanceDays',
                      checked ? 60 : null
                    )
                  }
                />
                <Input
                  type="number"
                  value={
                    formik.values.schedulingWindow.maxAdvanceDays?.toString() ||
                    '60'
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      'schedulingWindow.maxAdvanceDays',
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-20 border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300">days</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm">
                Minimum time before the appointment start that it can be booked
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Checkbox
                  checked={
                    formik.values.schedulingWindow.minAdvanceHours !== null
                  }
                  onValueChange={(checked) =>
                    formik.setFieldValue(
                      'schedulingWindow.minAdvanceHours',
                      checked ? 4 : null
                    )
                  }
                />
                <Input
                  type="number"
                  value={
                    formik.values.schedulingWindow.minAdvanceHours?.toString() ||
                    '4'
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      'schedulingWindow.minAdvanceHours',
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-20 border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300">hours</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adjusted Availability */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('adjustedAvailability')}
          className="hover:bg-gray-750 flex w-full items-center justify-between p-6"
        >
          <div className="flex items-center gap-2">
            <Icon icon="mdi:clock" className="h-4 w-4" />
            <div className="text-left">
              <h3 className="font-medium">Adjusted availability</h3>
              <div className="text-sm">
                Indicate times you're available for specific dates
              </div>
            </div>
          </div>
          {expandedSections.adjustedAvailability ? (
            <Icon icon="mdi:chevron-up" className="h-4 w-4" />
          ) : (
            <Icon icon="mdi:chevron-down" className="h-4 w-4" />
          )}
        </button>

        {expandedSections.adjustedAvailability && (
          <div className="px-6 pb-6">
            <Button
              variant="outline"
              className="w-full border-gray-600 bg-gray-700 hover:bg-gray-600"
            >
              Change a date's availability
            </Button>
          </div>
        )}
      </div>

      {/* Booked Appointment Settings */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('bookedSettings')}
          className="hover:bg-gray-750 flex w-full items-center justify-between p-6"
        >
          <div className="flex items-center gap-2">
            <Icon icon="mdi:settings" className="h-4 w-4" />
            <div className="text-left">
              <h3 className="font-medium">Booked appointment settings</h3>
              <div className="text-sm">
                {formik.values.bufferTime > 0
                  ? `${formik.values.bufferTime} minutes buffer`
                  : 'No buffer time'}{' '}
                ·{' '}
                {formik.values.maxBookingsPerDay
                  ? `${formik.values.maxBookingsPerDay} max bookings`
                  : 'No maximum bookings'}{' '}
                per day · Guest permissions
              </div>
            </div>
          </div>
          {expandedSections.bookedSettings ? (
            <Icon icon="mdi:chevron-up" className="h-4 w-4" />
          ) : (
            <Icon icon="mdi:chevron-down" className="h-4 w-4" />
          )}
        </button>

        {expandedSections.bookedSettings && (
          <div className="space-y-6 px-6 pb-6">
            <div>
              <h3 className="font-medium">Buffer time</h3>
              <p className="mb-3 text-sm">Add time between appointment slots</p>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formik.values.bufferTime > 0}
                  onValueChange={(checked) =>
                    formik.setFieldValue('bufferTime', checked ? 30 : 0)
                  }
                />
                <NumberInput
                  value={formik.values.bufferTime}
                  onValueChange={(value) =>
                    formik.setFieldValue('bufferTime', Number.parseInt(value))
                  }
                  className="w-20 border-gray-600 bg-gray-700"
                  disabled={formik.values.bufferTime === 0}
                />
                <span className="text-gray-300">minutes</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Maximum bookings per day</h3>
              <p className="mb-3 text-sm">
                Limit how many booked appointments to accept in a single day
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formik.values.maxBookingsPerDay !== null}
                  onValueChange={(checked) =>
                    formik.setFieldValue(
                      'maxBookingsPerDay',
                      checked ? 4 : null
                    )
                  }
                />
                <NumberInput
                  value={formik.values.maxBookingsPerDay?.toString() || '4'}
                  onValueChange={(value) =>
                    formik.setFieldValue(
                      'maxBookingsPerDay',
                      Number.parseInt(value)
                    )
                  }
                  className="w-20 border-gray-600 bg-gray-700"
                  disabled={formik.values.maxBookingsPerDay === null}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium">Guest permissions</h3>
              <div className="mt-3 flex items-center gap-2">
                <Checkbox
                  checked={formik.values.guestPermissions.canInviteOthers}
                  onValueChange={(checked) =>
                    formik.setFieldValue(
                      'guestPermissions.canInviteOthers',
                      !!checked
                    )
                  }
                />
                <div>
                  <div className="text-sm">Guests can invite others</div>
                  <div className="text-xs">
                    After booking an appointment guests can modify the calendar
                    event to invite others
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendars */}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon icon="mdi:calendar" className="h-4 w-4 text-blue-400" />
          <h3 className="font-medium">Calendars</h3>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
        </div>
      </div>

      <div className="border-t p-6">
        <Button
          onPress={handleNextClick}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
