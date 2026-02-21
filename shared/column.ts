export enum ColumnDataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DATE = 'DATE',
}

export enum ColumnType {
  DEFAULT = 'DEFAULT',
  CHIP = 'CHIP',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
}

export enum TableViewType {
  QUEUE = 'QUEUE',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  USER = 'USER',
  COMMON = 'COMMON',
}

export type ColumnDefinition = {
  id: string;
  name: string;
  key: string;
  data_type: ColumnDataType;
};

export type SelectedColumnDefinition = ColumnDefinition & {
  order: number;
  pinned: boolean;
  width?: number;
};
