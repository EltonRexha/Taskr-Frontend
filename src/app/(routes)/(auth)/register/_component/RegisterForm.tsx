'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UserSchema } from '@/schemas/userSchema';
import z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import PasswordInput from '@/components/PasswordInput';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { CodeInput } from './CodeInput';
import { useRouter } from 'next/navigation';
import { OAuthStrategy } from '@clerk/types'
import { toast } from 'sonner';

type FormData = z.infer<typeof UserSchema>;

function RegisterForm() {
    const { signUp, setActive } = useSignUp();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(UserSchema),
    })
    const [showDisplayCode, setShowDisplayCode] = useState(false);
    const [codeError, setCodeError] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [signupLoading, setSignupLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        if (!signUp) {
            toast.error("Sign-up is not available at the moment. Please try again later.");
            return;
        };

        setSignupLoading(true);

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setShowDisplayCode(true);

        } catch (err: any) {
            setError(err.errors?.[0]?.longMessage || "An error occurred during sign up. Please try again.");
        } finally {
            setSignupLoading(false);
        }
    }

    const handleCodeComplete = async (code: string) => {
        if (!signUp) {
            toast.error("Sign-up is not available at the moment. Please try again later.");
            return;
        };

        try {
            const attempt = await signUp.attemptEmailAddressVerification({ code });

            if (attempt.status !== "complete") {
                setCodeError("Invalid code. Please try again.");
            }

            if (attempt.status === "complete") {
                setActive({ session: attempt.createdSessionId });
                router.push("/");
            }

        } catch (e) {
            setCodeError("An error occurred during verification. Please try again.");
        }
    }

    const handleResend = async () => {
        if (!signUp) {
            toast.error("Sign-up is not available at the moment. Please try again later.");
            return;
        };

        try {
            setCodeError(undefined); // clear any previous error
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            alert(`Verification code resent to ${watch("email")}`);
        } catch (err: any) {
            setCodeError("Failed to resend verification code. Please try again.");
        }
    }

    const signUpWith = async (strategy: OAuthStrategy) => {
        if (!signUp) {
            toast.error("Sign-up is not available at the moment. Please try again later.");
            return;
        };

        setSignupLoading(true);
        try {
            await signUp.authenticateWithRedirect({
                strategy,
                redirectUrl: '/',
                redirectUrlComplete: '/',
            })
        } catch (err) {
            toast.error("Couldn't sign in with the selected provider. Please try again.");
        } finally {
            setSignupLoading(false);
        }

    };

    const email = watch("email");

    return (
        <>
            <form className={`p-4 lg:p-6 lg:border-2 ${showDisplayCode && 'hidden'}`} onSubmit={handleSubmit(async (data) => {
                await onSubmit(data);
            })}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend><p className="text-xl">Create Account</p></FieldLegend>
                        <FieldDescription>
                            Sign up for a new account
                        </FieldDescription>
                        <FieldGroup>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <Field className="flex-1">
                                    <FieldLabel htmlFor="first-name" className="text-lg">
                                        First Name
                                    </FieldLabel>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        required
                                        className="h-10 text-base"
                                        {...register('firstName')}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                    )}
                                </Field>
                                <Field className="flex-1">
                                    <FieldLabel htmlFor="last-name" className="text-lg">
                                        Last Name
                                    </FieldLabel>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        required
                                        className="h-10 text-base"
                                        {...register('lastName')}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                    )}
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email" className="text-lg">
                                    Email
                                </FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="h-10 text-base"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password" className="text-lg">
                                    Password
                                </FieldLabel>
                                <PasswordInput error={errors.password?.message} className="h-10 text-base pr-10"
                                    {...register('password')} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword" className="text-lg">
                                    Confirm Password
                                </FieldLabel>
                                <PasswordInput error={errors.confirmPassword?.message} className="h-10 text-base pr-10"
                                    {...register('confirmPassword')} id="confirmPassword" />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <div>
                        <div id="clerk-captcha"></div>
                        <p className='text-red-500 text-sm my-1'>{error}</p>
                        <Link href="/login" className="text-blue-500 w-fit">Already Have An Account?</Link>
                    </div>

                    <Field className="w-full">
                        <Button type="submit" className="cursor-pointer w-full h-12 text-lg" disabled={signupLoading}>Sign up</Button>
                    </Field>
                    <Field className="w-full">
                        <Button type="button" disabled={signupLoading} variant="outline" className="cursor-pointer w-full h-12 text-lg inline-flex items-center justify-center gap-2" onClick={() => signUpWith('oauth_google')}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign up with Google
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            {showDisplayCode && (
                <CodeInput onComplete={(code) => { handleCodeComplete(code) }} email={email} error={codeError} resend={handleResend} />
            )}
        </>
    )
}

export default RegisterForm