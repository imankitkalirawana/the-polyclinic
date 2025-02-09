import mongoose, { Schema, Document } from 'mongoose';
import { Base } from '@/lib/interface';

interface SortDescriptor {
  column: string;
  direction: 'ascending' | 'descending';
}

interface DataTableConfig {
  columns: string[];
  status: string[];
  sortDescriptor: SortDescriptor;
  limit: number;
}

export interface UserConfigType extends Omit<Base, '_id'>, Document {
  userId: string;
  config: {
    'data-table': {
      appointments?: DataTableConfig;
      users?: DataTableConfig;
      services?: DataTableConfig;
      drugs?: DataTableConfig;
      [key: string]: DataTableConfig | undefined;
    };
  };
}

const SortDescriptorSchema: Schema = new Schema({
  column: { type: String, required: true },
  direction: { type: String, enum: ['ascending', 'descending'], required: true }
});

const DataTableConfigSchema: Schema = new Schema({
  columns: { type: [String], required: true },
  status: { type: [String], required: true },
  sortDescriptor: { type: SortDescriptorSchema, required: true },
  limit: { type: Number, required: true }
});

const defaultAppointmentsConfig: DataTableConfig = {
  columns: [
    'status',
    'aid',
    'patient.name',
    'date',
    'doctor.name',
    'createdAt',
    'actions'
  ],
  status: [
    'booked',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
    'overdue',
    'on-hold'
  ],
  sortDescriptor: { column: 'date', direction: 'ascending' },
  limit: 10
};

const UserConfigSchema: Schema = new Schema({
  uid: { type: Number, required: true, unique: true },
  config: {
    'data-table': {
      appointments: {
        type: DataTableConfigSchema,
        default: defaultAppointmentsConfig
      },
      users: { type: DataTableConfigSchema, default: {} },
      services: { type: DataTableConfigSchema, default: {} },
      drugs: { type: DataTableConfigSchema, default: {} }
      // Add more tables as needed
    }
  }
});

export default mongoose.models.UserConfig ||
  mongoose.model<UserConfigType>('UserConfig', UserConfigSchema);
