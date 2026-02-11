export const DATA_TABLE_DEFAULTS = {
  MIN_COLUMN_WIDTH: 100,
  MAX_COLUMN_WIDTH: 600,
  AUTO_FILL_SELECTION_LIMIT: 30,
  SCROLL_BOTTOM_REACHED_TRIGGER_OFFSET: 325,
  ROW_HEIGHT: 48,
} as const;

/* Some colors in design are not in the global theme, defining theme here for DataTable */
export const TABLE_THEME = {
  ROW_HIGHLIGHT_BACKGROUND: '#E6F2FF',
};
