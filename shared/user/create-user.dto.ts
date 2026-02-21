import { z } from 'zod';
import { AuthSource, CompanyType, UserRole } from '../../enums';
import {
  emailValidation,
  nameValidation,
  nullableStringValidation,
  passwordValidation,
  phoneNumberValidation,
} from '../factory.dto';

export const createUserSchema = z.object({
  email: emailValidation,

  password: passwordValidation.nullable().optional(),

  name: nameValidation,

  role: z.enum(UserRole).optional().default(UserRole.PATIENT),

  company_type: z.enum(CompanyType).optional(),

  phone: phoneNumberValidation.nullable().optional(),

  time_zone: nullableStringValidation,

  auth_source: z.enum(AuthSource).optional(),

  /**
   * Optional list of tenant schema slugs this user can access.
   * Values are normalized/validated server-side.
   */
  companies: z.array(z.string()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
