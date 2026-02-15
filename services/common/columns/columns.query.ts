import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';
import { ColumnsApi } from './columns.api';
import { SelectedColumnDefinition, TableViewType } from './columns.types';

export const useAllColumns = (viewType: TableViewType) =>
  useGenericQuery({
    queryKey: ['columns', viewType],
    queryFn: () => ColumnsApi.getColumns(viewType),
  });

export const useSelectedColumns = (viewType: TableViewType) =>
  useGenericQuery({
    queryKey: ['selected-columns', viewType],
    queryFn: () => ColumnsApi.getSelectedColumns(viewType),
  });

export const useUpdateColumns = () =>
  useGenericMutation({
    mutationFn: ({
      viewType,
      columns,
    }: {
      viewType: TableViewType;
      columns: SelectedColumnDefinition[];
    }) => ColumnsApi.updateColumns(viewType, columns),
    invalidateAllQueries: true,
    showToast: false,
  });
