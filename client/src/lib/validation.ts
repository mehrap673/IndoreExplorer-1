import { z } from 'zod';

// Frontend-safe contact form validation schema (no mongoose imports)
export const contactMessageValidation = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export type ContactFormData = z.infer<typeof contactMessageValidation>;