'use client';

import React from 'react';
import { Button, Input, Select, SelectItem, Tooltip } from '@heroui/react';
import type { FormikProps } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';

import { getValidEndTimes, getValidStartTimes, timeToMinutes } from './util';
import { SlotConfig, SpecificDateAvailability, TimeSlot } from '@/services/client/doctor';

interface SpecificDateManagerProps {
  formik: FormikProps<SlotConfig>;
}

export function SpecificDateManager({ formik }: SpecificDateManagerProps) {
  // Remove these lines:
  // const [isAddingDate, setIsAddingDate] = useState(false)
  // const [newDate, setNewDate] = useState("")

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getDurationIncrement = (): number => {
    const { duration } = formik.values;
    if (duration >= 60) return 30;
    if (duration >= 30) return 15;
    return 15;
  };

  // Replace the `startAddingDate`, `cancelAddingDate`, and `saveNewDate` functions with a single function that directly adds the date:
  const addNewDate = () => {
    const tomorrow = getTomorrowDate();

    const newSpecificDate: SpecificDateAvailability = {
      date: tomorrow,
      enabled: true,
      slots: [{ id: Date.now().toString(), start: '09:00', end: '17:00' }],
    };

    const currentSpecificDates = [...formik.values.availability.specificDates];
    // Check if date already exists
    const existingIndex = currentSpecificDates.findIndex((d) => d.date === tomorrow);

    if (existingIndex === -1) {
      currentSpecificDates.push(newSpecificDate);
      // Sort dates chronologically
      currentSpecificDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      formik.setFieldValue('availability.specificDates', currentSpecificDates);
    }
  };

  const handleDateChange = (dateIndex: number, newDateValue: string) => {
    if (!newDateValue) return;

    const currentSpecificDates = [...formik.values.availability.specificDates];
    currentSpecificDates[dateIndex] = {
      ...currentSpecificDates[dateIndex],
      date: newDateValue,
    };

    // Sort dates chronologically
    currentSpecificDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    formik.setFieldValue('availability.specificDates', currentSpecificDates);
  };

  const handleRemoveDate = (index: number) => {
    const currentSpecificDates = [...formik.values.availability.specificDates];
    currentSpecificDates.splice(index, 1);
    formik.setFieldValue('availability.specificDates', currentSpecificDates);
  };

  const updateSpecificDateEnabled = (index: number, enabled: boolean) => {
    formik.setFieldValue(`availability.specificDates.${index}.enabled`, enabled);
  };

  const updateSpecificDateSlot = (
    dateIndex: number,
    slotId: string,
    field: 'start' | 'end',
    value: string
  ) => {
    const specificDate = formik.values.availability.specificDates[dateIndex];
    const slotIndex = specificDate.slots.findIndex((slot) => slot.id === slotId);
    if (slotIndex === -1) return;

    const currentSlot = specificDate.slots[slotIndex];

    if (field === 'start') {
      formik.setFieldValue(
        `availability.specificDates.${dateIndex}.slots.${slotIndex}.start`,
        value
      );

      // Auto-adjust end time if it's now invalid
      const startMinutes = timeToMinutes(value);
      const endMinutes = timeToMinutes(currentSlot.end);
      const minEndMinutes = startMinutes + formik.values.duration;

      if (endMinutes < minEndMinutes) {
        const validEndTimes = getValidEndTimes(
          value,
          getDurationIncrement(),
          formik.values.duration
        );
        if (validEndTimes.length > 0) {
          formik.setFieldValue(
            `availability.specificDates.${dateIndex}.slots.${slotIndex}.end`,
            validEndTimes[0]
          );
        }
      }
    } else {
      formik.setFieldValue(`availability.specificDates.${dateIndex}.slots.${slotIndex}.end`, value);
    }
  };

  const addSpecificDateSlot = (dateIndex: number) => {
    const specificDate = formik.values.availability.specificDates[dateIndex];
    const lastSlot = specificDate.slots[specificDate.slots.length - 1];
    const durationIncrement = getDurationIncrement();

    const validStartTimes = getValidStartTimes(durationIncrement, lastSlot?.end);

    if (validStartTimes.length === 0) return;

    const newStartTime = validStartTimes[0];
    const validEndTimes = getValidEndTimes(newStartTime, durationIncrement, formik.values.duration);
    const newEndTime = validEndTimes.length > 0 ? validEndTimes[0] : newStartTime;

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: newStartTime,
      end: newEndTime,
    };

    const updatedSlots = [...specificDate.slots, newSlot];
    formik.setFieldValue(`availability.specificDates.${dateIndex}.slots`, updatedSlots);
  };

  const removeSpecificDateSlot = (dateIndex: number, slotId: string) => {
    const specificDate = formik.values.availability.specificDates[dateIndex];
    const updatedSlots = specificDate.slots.filter((slot) => slot.id !== slotId);
    const finalSlots =
      updatedSlots.length > 0 ? updatedSlots : [{ id: '1', start: '09:00', end: '17:00' }];

    formik.setFieldValue(`availability.specificDates.${dateIndex}.slots`, finalSlots);
  };

  const getPreviousSlotEndTime = (
    dateIndex: number,
    currentSlotIndex: number
  ): string | undefined => {
    const specificDate = formik.values.availability.specificDates[dateIndex];
    if (currentSlotIndex === 0) return undefined;
    return specificDate.slots[currentSlotIndex - 1]?.end;
  };

  const durationIncrement = getDurationIncrement();

  return (
    <div className="space-y-4">
      {formik.values.availability.specificDates.length > 0 && (
        <div>
          {formik.values.availability.specificDates.map((specificDate, dateIndex) => (
            <div key={specificDate.date} className="space-y-3">
              <Input
                aria-label="Date"
                type="date"
                value={specificDate.date}
                min={getTomorrowDate()}
                onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                className="max-w-36"
              />
              <div className="grid grid-cols-10 items-center gap-2">
                {specificDate.enabled ? (
                  specificDate.slots.map((slot, slotIndex) => {
                    const previousSlotEndTime = getPreviousSlotEndTime(dateIndex, slotIndex);
                    const validStartTimes = getValidStartTimes(
                      durationIncrement,
                      previousSlotEndTime
                    );
                    const validEndTimes = getValidEndTimes(
                      slot.start,
                      durationIncrement,
                      formik.values.duration
                    );
                    const isLastSlot = specificDate.slots.length === 1;

                    return (
                      <React.Fragment key={slot.id}>
                        <Select
                          aria-label="Start time"
                          value={slot.start}
                          className="col-span-3"
                          defaultSelectedKeys={[slot.start]}
                          onSelectionChange={(value) =>
                            updateSpecificDateSlot(
                              dateIndex,
                              slot.id,
                              'start',
                              value.currentKey || ''
                            )
                          }
                        >
                          {validStartTimes.map((time) => (
                            <SelectItem key={time} className="">
                              {time}
                            </SelectItem>
                          ))}
                        </Select>
                        <span className="flex items-center justify-center text-center text-default-500">
                          -
                        </span>
                        <Select
                          aria-label="End time"
                          value={slot.end}
                          className="col-span-3"
                          defaultSelectedKeys={[slot.end]}
                          onSelectionChange={(value) =>
                            updateSpecificDateSlot(
                              dateIndex,
                              slot.id,
                              'end',
                              value.currentKey || ''
                            )
                          }
                        >
                          {validEndTimes.map((time) => (
                            <SelectItem key={time} className="">
                              {time}
                            </SelectItem>
                          ))}
                        </Select>
                        <Tooltip
                          delay={1000}
                          content={isLastSlot ? 'Unavailable all day' : 'Unavailable'}
                        >
                          <Button
                            isIconOnly
                            type="button"
                            variant="light"
                            size="sm"
                            onPress={() => {
                              if (isLastSlot) {
                                updateSpecificDateEnabled(dateIndex, false);
                              } else {
                                removeSpecificDateSlot(dateIndex, slot.id);
                              }
                            }}
                            radius="full"
                          >
                            <Icon icon="solar:forbidden-circle-outline" width={20} />
                          </Button>
                        </Tooltip>
                        {slotIndex === 0 && (
                          <>
                            <Tooltip delay={1000} content="Add another period for this date">
                              <Button
                                isIconOnly
                                type="button"
                                variant="light"
                                size="sm"
                                onPress={() => addSpecificDateSlot(dateIndex)}
                                isDisabled={
                                  getValidStartTimes(
                                    durationIncrement,
                                    specificDate.slots[specificDate.slots.length - 1]?.end
                                  ).length === 0
                                }
                                radius="full"
                              >
                                <Icon icon="solar:add-circle-linear" width={20} />
                              </Button>
                            </Tooltip>

                            <Tooltip delay={1000} content="Remove this date">
                              <Button
                                isIconOnly
                                type="button"
                                variant="light"
                                size="sm"
                                onPress={() => handleRemoveDate(dateIndex)}
                                radius="full"
                              >
                                <Icon icon="solar:close-circle-linear" width={20} />
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    <div className="col-span-8 text-sm text-default-400">Unavailable</div>
                    <Tooltip delay={1000} content="Add another period for this date">
                      <Button
                        isIconOnly
                        type="button"
                        variant="light"
                        size="sm"
                        onPress={() => updateSpecificDateEnabled(dateIndex, true)}
                        radius="full"
                      >
                        <Icon icon="solar:add-circle-linear" width={20} />
                      </Button>
                    </Tooltip>

                    <Tooltip delay={1000} content="Remove this date">
                      <Button
                        isIconOnly
                        type="button"
                        variant="light"
                        size="sm"
                        onPress={() => handleRemoveDate(dateIndex)}
                        radius="full"
                      >
                        <Icon icon="solar:close-circle-linear" width={20} />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update the button at the bottom to call the new function and remove the `!isAddingDate` condition: */}
      <Button type="button" color="primary" variant="bordered" onPress={addNewDate} radius="full">
        Change a date&apos;s availability
      </Button>
    </div>
  );
}
