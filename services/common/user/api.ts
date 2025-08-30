import { fetchData } from '@/services/fetch';
import { UnifiedUser } from './types';

export class User {
  private static API_BASE = '/common/users';

  static async getAll() {
    return await fetchData<UnifiedUser[]>(this.API_BASE);
  }
}
