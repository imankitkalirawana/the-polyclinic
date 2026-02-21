import { z } from 'zod';

export const googleAuthSchema = z.object({
  credential: z.string(),
});

export type GoogleAuthDto = z.infer<typeof googleAuthSchema>;
