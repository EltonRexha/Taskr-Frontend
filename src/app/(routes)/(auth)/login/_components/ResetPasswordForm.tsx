'use client';
import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const ResetPasswordSchema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(ResetPasswordSchema)
    });
    const [error, setError] = useState<string | undefined>(undefined);
    const { signIn } = useSignIn();
    const router = useRouter()

    const onSubmit = async ({ password }: ResetPasswordFormData) => {
        if (!signIn) {
            toast.error("Sign-in is not available at the moment. Please try again later.");
            return;
        }

        console.log({ password });

        try {
            const result = await signIn.resetPassword({
                password,
                signOutOfOtherSessions: true
            })

            if (result.status === "complete") {
                toast.success("Password has been reset successfully. You can now log in with your new password.");
                router.push('/')
            }
        } catch (err: any) {
            const message =
                err?.errors?.[0]?.message ?? "Password does not meet requirements";
            setError(message);
        }
    }

    return (
        <form className="p-4 lg:p-6 lg:border-2" onSubmit={handleSubmit(async (data) => {
            await onSubmit(data);
        })} noValidate>
            <FieldSet>
                <FieldLegend><p className="text-xl">Reset Password</p></FieldLegend>
                <FieldDescription>
                    Please provide your new password below.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="password" className="text-lg">
                            Password
                        </FieldLabel>
                        <PasswordInput
                            className="h-10 text-base"
                            {...register('password')}
                            id="password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword" className="text-lg">
                            Confirm Password
                        </FieldLabel>
                        <PasswordInput
                            className="h-10 text-base"
                            {...register('confirmPassword')}
                            id="confirmPassword"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>
            {error && <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>}
            <Field className="w-full">
                <Button type="submit" className="cursor-pointer w-full h-12 text-lg">Reset Password</Button>
            </Field>
        </form>
    )
}

export default ResetPasswordForm