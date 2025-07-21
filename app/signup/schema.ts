
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
 phone: z.string()
  .min(6, 'Phone number must be at least 6 characters')
  .max(20, 'Phone number must be at most 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters') .regex(/\d/, 'Password must contain at least one digit'),
  confirmPassword: z.string().min(6, 'Confirm Password is required') .regex(/\d/, 'Password must contain at least one digit'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});



export const loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});