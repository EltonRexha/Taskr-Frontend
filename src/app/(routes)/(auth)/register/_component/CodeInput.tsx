"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CodeInputProps {
    length?: number;
    onComplete: (code: string) => void;
    email: string;
    error?: string;
}

export function CodeInput({ length = 6, onComplete, email, error }: CodeInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/\D/, "");
        if (!val) return;

        const newValues = [...values];
        newValues[idx] = val[0];
        setValues(newValues);

        // move focus to next
        if (idx < length - 1) {
            inputsRef.current[idx + 1]?.focus();
        }

        // if all filled
        if (newValues.every((v) => v !== "")) {
            onComplete(newValues.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValues = [...values];
            if (values[idx]) {
                newValues[idx] = "";
                setValues(newValues);
            } else if (idx > 0) {
                newValues[idx - 1] = "";
                setValues(newValues);
                inputsRef.current[idx - 1]?.focus();
            }
        }
    };

    return (
        <div className="p-6 border-2 max-w-md mx-auto">
            <h1 className="text-xl font-semibold text-foreground">Confirm Your Account</h1>
            
            <p className="text-muted-foreground mt-2">
                We’ve sent a <strong>{length}-digit code</strong> to your email:{" "}
                <span className="font-medium">{email}</span>.
            </p>

            <p className="text-sm text-muted-foreground mt-1">
                Please check your inbox (and spam/junk folder) and enter the code below to verify your account.
            </p>

            <div className="flex gap-2 justify-center mt-4">
                {values.map((val, idx) => (
                    <Input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        ref={(el) => {
                            inputsRef.current[idx] = el;
                        }}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-12 text-center text-lg h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <p className="text-sm text-muted-foreground mt-4 text-center">
                Didn’t receive the code? <button className="underline text-blue-600 hover:text-blue-800">Resend</button>
            </p>
        </div>
    );
}
