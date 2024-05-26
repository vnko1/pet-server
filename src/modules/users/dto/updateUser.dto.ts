import { z } from 'zod';
import {
  cityRegex,
  emailRegex,
  phoneRegex,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from 'src/utils';

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must contain min 2 symbols')
      .max(15, 'Name must contain max 15 symbols')
      .optional(),
    email: z
      .string()
      .email('Email is not valid')
      .regex(emailRegex, 'Email is not valid')
      .optional(),
    birthday: z.coerce
      .date()
      .min(new Date('1940-01-01'), 'Too old')
      .max(new Date(), 'Too young')
      .optional(),
    city: z
      .string()
      .min(2, 'City must contain min 2 symbols')
      .max(30, 'City must contain max 30 symbols')
      .regex(cityRegex, 'Invalid city')
      .optional(),
    phone: z
      .string()
      .min(13, 'Phone must contain min 13 symbols')
      .regex(phoneRegex, 'Invalid phone')
      .optional(),
    file: z
      .any()
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE;
      }, `Max image size is 3MB.`)
      .refine((file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file?.mimetype);
      }, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
      .optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).some((key) => data[key] !== undefined);
    },
    {
      message: 'At least one field must be provided.',
      path: [],
    },
  );

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
