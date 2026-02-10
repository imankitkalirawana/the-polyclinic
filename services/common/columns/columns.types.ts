export enum ColumnDataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  HASHTAG = 'HASHTAG',
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
  label: string;
  key: string;
  type: ColumnDataType;
  hidden?: boolean;
};
