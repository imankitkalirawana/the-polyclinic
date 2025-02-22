const LOCAL_STORAGE_KEY = 'config';

export function saveTableConfig(table: string, config: any) {
  const existingConfig = JSON.parse(
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(LOCAL_STORAGE_KEY)
      : null) || '{}'
  );
  existingConfig['data-table'] = existingConfig['data-table'] || {};
  existingConfig['data-table'][table] = config;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingConfig));
}

export function loadTableConfig(table: string) {
  const existingConfig = JSON.parse(
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(LOCAL_STORAGE_KEY)
      : null) || '{}'
  );
  return existingConfig['data-table']
    ? existingConfig['data-table'][table]
    : null;
}
