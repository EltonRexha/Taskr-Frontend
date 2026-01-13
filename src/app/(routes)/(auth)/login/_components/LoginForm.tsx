/* eslint-disable react-hooks/incompatible-library */
'use client'
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { OAuthStrategy } from '@clerk/types'
import { useSignIn } from "@clerk/nextjs"
import { LoginSchema } from "@/schemas/loginSchema"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import PasswordInput from "@/components/PasswordInput"
import { useState } from "react"
import { SecondFactorAuth } from "../../../../../components/SecondFactor"
import { toast } from "sonner"
import PasswordReset from "./PasswordReset"
import { motion } from "framer-motion"
import { ClerkError } from "../../../../../../types/ClerkError"

type FormData = z.infer<typeof LoginSchema>;

const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function LoginForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(LoginSchema)
    });

    const { signIn } = useSignIn();
    const router = useRouter()
    const [showSecondFactor, setShowSecondFactor] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [codeError, setCodeError] = useState<string | undefined>(undefined);
    const [loginError, setLoginError] = useState<string | undefined>(undefined);

    if (!signIn) {
        return;
    };

    const signInWith = async (strategy: OAuthStrategy) => {
        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: '/',
                redirectUrlComplete: '/',
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Couldn't sign in with the selected provider. Please try again.");
        }

    }

    const onSubmit = async ({ email, password }: FormData) => {
        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })

            if (result.status === "complete") {
                router.push("/")
            }

            if (result.status === "needs_second_factor") {
                await signIn.prepareSecondFactor({
                    strategy: "email_code",
                })
                setShowSecondFactor(true);
            }
        } catch (err: unknown) {
            const error = err as ClerkError;
            if (error.errors[0].code === "strategy_for_user_invalid") {
                setLoginError("Please try to login with your correct provider below.");
            } else {
                setLoginError(error.errors?.[0]?.longMessage || "An error occurred during sign in. Please try again.");
            }
        }
    }

    const handleSecondFactorResend = async () => {
        try {
            await signIn.prepareSecondFactor({
                strategy: "email_code",
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            toast.error("Failed to resend email");
        }

    }

    const handleSecondFactor = async (code: string) => {
        try {
            await signIn.attemptSecondFactor({
                strategy: "email_code",
                code,
            })

            if (signIn.status === "complete") {
                router.push("/")
            }

            if (signIn.status !== "complete") {
                setCodeError("Invalid code. Please try again.");
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setCodeError("Invalid code. Please try again.");
        }

    }

    const email = watch('email');

    return (
        <>
            <motion.form className={`p-4 lg:p-6 lg:border-2 rounded-sm ${(showSecondFactor || showResetPassword) && 'hidden'}`} onSubmit={handleSubmit(onSubmit)}
                variants={variants}
                animate="visible"
                initial="hidden"
                noValidate>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend><p className="text-xl">Welcome Back!</p></FieldLegend>
                        <FieldDescription>
                            Please Enter Your Credentials
                        </FieldDescription>
                        <FieldGroup>
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
                                    <p className="text-red-500 text-sm -mb-2">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password" className="text-lg">
                                    Password
                                </FieldLabel>
                                <PasswordInput
                                    error={errors.password?.message}
                                    className="h-10 text-base"
                                    {...register('password')}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    {loginError && (
                        <p className="text-red-500 text-sm -mb-2">{loginError}</p>
                    )}
                    <div className="flex flex-col gap-1">
                        <Link href="/register" className="text-blue-500 w-fit">Don&apos;t have an account?</Link>
                        <button type="button" className="text-blue-500 w-fit cursor-pointer" onClick={() => setShowResetPassword(true)}>Forgot your password?</button>
                    </div>
                    <Field className="w-full">
                        <Button type="submit" className="w-full h-12 text-lg cursor-pointer">Login</Button>
                    </Field>
                    <Field className="w-full">
                        <Button type="button" variant="outline" className="cursor-pointer w-full h-12 text-lg inline-flex items-center justify-center gap-2" onClick={() => { signInWith('oauth_google') }}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login with Google
                        </Button>
                    </Field>
                </FieldGroup>
            </motion.form>
            {showSecondFactor && (
                <SecondFactorAuth onComplete={(code) => { handleSecondFactor(code) }} email={email} error={codeError} resend={handleSecondFactorResend} />
            )}
            {showResetPassword && <PasswordReset />}
        </>

    )
}




export default LoginForm