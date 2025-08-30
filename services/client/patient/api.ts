import { fetchData } from '@/services/fetch';
import { CreatePatient } from './types';

export class PatientApi {
  private static readonly API_BASE = '/client/patients';

  public static async getPatients() {
    return fetchData(`${this.API_BASE}`);
  }

  public static async createPatient(data: CreatePatient) {
    return fetchData(`${this.API_BASE}`, {
      method: 'POST',
      data,
    });
  }
}
