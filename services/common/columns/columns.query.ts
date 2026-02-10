import { useGenericQuery } from '@/services/useGenericQuery';
import { ColumnsApi } from './columns.api';
import { TableViewType } from './columns.types';

export const useAllColumns = (viewType: TableViewType) =>
  useGenericQuery({
    queryKey: ['columns', viewType],
    queryFn: () => ColumnsApi.getColumns(viewType),
  });
