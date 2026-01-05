import { z } from 'zod';

export const UserSchema = z
    .object({
        email: z.email().nonempty('Email is required'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(20, 'Password must not exceed 20 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[@$!%*?&#]/,
                'Password must contain at least one special character'
            ),
        confirmPassword: z.string(),
        firstName: z
            .string()
            .nonempty('First Name is required')
            .max(20, 'First name is too long')
            .min(3, 'First name is too short')
            .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
        lastName: z
            .string()
            .max(20, 'Last name is too long')
            .min(3, 'Last name is too short')
            .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters')
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });