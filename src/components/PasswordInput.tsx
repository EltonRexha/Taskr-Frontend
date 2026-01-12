'use client';

import { useState } from 'react'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ error, ...props }: { error?: string;[key: string]: any }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && (
                <p className="text-red-500 text-sm -mb-2">{error}</p>
            )}
        </>

    )
}

export default PasswordInput