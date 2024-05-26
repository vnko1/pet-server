import { z } from 'zod';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from 'src/utils';

export const createNoticeSchema = z
  .object({
    category: z.enum(['sell', 'lost-found', 'in-good-hands'], {
      required_error: 'Category is required',
    }),
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must contain min 2 symbols')
      .max(15, 'Name must contain max 15 symbols'),
    date: z.coerce
      .date({ required_error: 'Date is required' })
      .min(new Date('2000-01-01'), 'Too old')
      .max(new Date('Too young')),
    type: z
      .string({ required_error: 'Type is required' })
      .min(2, 'Type must contain min 2 symbols')
      .max(16, 'Type must contain max 16 symbols'),
    comments: z
      .string()
      .max(120, 'Comment must contain max 120 symbols')
      .optional(),
    sex: z.enum(['male', 'female'], { required_error: 'Sex is required' }),
    location: z
      .string({ required_error: 'Location is required' })
      .min(2, 'Location must contain min 2 symbols'),
    price: z.coerce.number().positive('Invalid price').optional(),
    file: z
      .any()
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE;
      }, `Max image size is 3MB.`)
      .refine((file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file?.mimetype);
      }, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
  })
  .refine(
    (data) => {
      if ('sell' === data.category && !data.price) return false;

      return true;
    },
    {
      message: 'Price is required',
      path: ['price'],
    },
  );

export type CreateNoticeDto = z.infer<typeof createNoticeSchema>;
