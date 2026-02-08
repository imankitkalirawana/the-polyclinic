export enum ColumnDataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  HASHTAG = 'HASHTAG',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
}

export type ColumnDefinition = {
  key: string;
  name: string;
  data_type: ColumnDataType;
  order: number;
};

export type CellOption = {
  value: string;
};

export type RowData = Record<string, CellOption>;

export type TableProps = {
  columns: ColumnDefinition[];
  rows: RowData[];
};
