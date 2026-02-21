export type Base = {
  id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedBy?: string;
  deletedAt?: Date | string | null;
};
