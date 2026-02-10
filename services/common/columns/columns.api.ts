import { apiRequest } from '@/libs/axios';
import { ColumnDefinition, TableViewType } from './columns.types';

export class ColumnsApi {
  private static API_BASE = '/table-views';

  static async getColumns(viewType: TableViewType) {
    return await apiRequest<ColumnDefinition[]>({
      url: `${this.API_BASE}/columns`,
      params: { view_type: viewType },
    });
  }
}
