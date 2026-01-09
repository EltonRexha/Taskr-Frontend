import { z } from 'zod';

export const UserSchema = z
    .object({
        email: z.email().nonempty('Email is required'),
        password: z
            .string(),
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