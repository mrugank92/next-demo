import { z } from 'zod';

/**
 * Validation schema for user sign-up
 */
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

/**
 * Validation schema for user sign-in
 */
export const signInSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;