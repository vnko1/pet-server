import { z } from 'zod';
import { emailRegex, passwordRegex } from 'src/utils';

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must contain min 2 symbols')
      .max(15, 'Name must contain max 15 symbols'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is not valid')
      .regex(emailRegex, 'Email is not valid'),
    password: z
      .string({ required_error: 'Password is required' })
      .regex(passwordRegex, 'Invalid password')
      .min(6, 'Password must contain min 2 symbols')
      .max(16, 'Password must contain max 16 symbols'),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
