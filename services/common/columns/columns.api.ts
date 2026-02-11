import { apiRequest } from '@/libs/axios';
import { ColumnDefinition, SelectedColumnDefinition, TableViewType } from './columns.types';

export class ColumnsApi {
  private static API_BASE = '/table-views';

  static async getColumns(viewType: TableViewType) {
    return await apiRequest<ColumnDefinition[]>({
      url: `${this.API_BASE}/columns`,
      params: { view_type: viewType },
    });
  }

  static async getSelectedColumns(viewType: TableViewType) {
    return await apiRequest<SelectedColumnDefinition[]>({
      url: `${this.API_BASE}/columns/selected`,
      params: { view_type: viewType },
    });
  }

  // update columns
  static async updateColumns(viewType: TableViewType, columns: SelectedColumnDefinition[]) {
    return await apiRequest({
      url: `${this.API_BASE}/columns`,
      method: 'PATCH',
      params: { view_type: viewType },
      data: {
        columns,
      },
    });
  }
}
