import z from "zod";

export const LoginSchema = z.object({
    email: z.email().nonempty('Email is required'),
    password: z.string().nonempty('Password is required')
})