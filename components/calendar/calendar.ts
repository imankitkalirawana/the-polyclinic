// sample booking durations
export enum DurationEnum {
  FiveMinutes = '5m',
  FifteenMinutes = '15m',
  ThirtyMinutes = '30m',
  OneHour = '1h',
}

export const durations = [
  { key: DurationEnum.FiveMinutes, label: '5m' },
  { key: DurationEnum.FifteenMinutes, label: '15m' },
  { key: DurationEnum.ThirtyMinutes, label: '30m' },
  { key: DurationEnum.OneHour, label: '1h' },
];

// sample time zone options
export const timeZoneOptions = Intl.supportedValuesOf('timeZone').map(
  (timeZone) => ({
    label: timeZone,
    value: timeZone,
  })
);

export enum TimeFormatEnum {
  TwelveHour = '12h',
  TwentyFourHour = '24h',
}

export const timeFormats = [
  { key: TimeFormatEnum.TwelveHour, label: '12h' },
  { key: TimeFormatEnum.TwentyFourHour, label: '24h' },
];

export interface TimeSlot {
  value: string;
  label: string;
}
