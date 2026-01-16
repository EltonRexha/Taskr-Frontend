"use client";
import { SecondFactorAuth } from "@/features/auth/components/SecondFactor";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";
import ResetPasswordForm from "./ResetPasswordForm";

const EmailSchema = z.object({
  email: z.email().nonempty("Email is required"),
});

type EmailFormData = z.infer<typeof EmailSchema>;

function PasswordReset() {
  const [resetCodeError, setResetCodeError] = useState<string | undefined>(
    undefined
  );
  const [showCode, setShowCode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(EmailSchema),
  });
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [email, setEmail] = useState<string>("");
  const { signIn } = useSignIn();

  const handlePasswordReset = async (code: string) => {
    if (!signIn) {
      toast.error(
        "Sign-in is not available at the moment. Please try again later."
      );
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (result.status === "needs_new_password") {
        setShowResetPasswordForm(true);
      }
    } catch (err: any) {
      setResetCodeError("Invalid code. Please try again.");
    }
  };

  const handlePasswordResetResend = async () => {
    if (!signIn) {
      toast.error(
        "Sign-in is not available at the moment. Please try again later."
      );
      return;
    }
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
    } catch (err: any) {
      toast.error("Failed to resend email");
    }
  };

  const onSubmit = async (data: EmailFormData) => {
    if (!signIn) {
      toast.error(
        "Sign-in is not available at the moment. Please try again later."
      );
      return;
    }

    setEmail(data.email);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      setShowCode(true);
    } catch (err: any) {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <>
      {showCode && !showResetPasswordForm && (
        <SecondFactorAuth
          onComplete={(code) => {
            handlePasswordReset(code);
          }}
          email={email}
          error={resetCodeError}
          resend={handlePasswordResetResend}
        />
      )}
      {!showCode && !showResetPasswordForm && (
        <form
          className="p-4 lg:p-6 lg:border-2"
          onSubmit={handleSubmit(async (data) => {
            await onSubmit(data);
          })}
          noValidate
        >
          <FieldSet>
            <FieldLegend>
              <p className="text-xl">Provide Your Email</p>
            </FieldLegend>
            <FieldDescription>
              We need your email to send you a password reset code.
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
                  className="h-10 text-base mb-5"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field className="w-full">
            <Button
              type="submit"
              className="cursor-pointer w-full h-12 text-lg"
            >
              Send Reset Email
            </Button>
          </Field>
        </form>
      )}
      {showResetPasswordForm && <ResetPasswordForm />}
    </>
  );
}

export default PasswordReset;
