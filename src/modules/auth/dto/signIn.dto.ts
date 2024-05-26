import { emailRegex } from 'src/utils';
import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is not valid')
      .regex(emailRegex, 'Email is not valid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must contain min 2 symbols')
      .max(16, 'Password must contain max 16 symbols'),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
