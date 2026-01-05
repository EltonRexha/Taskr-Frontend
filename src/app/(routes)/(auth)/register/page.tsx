'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserSchema } from "@/schemas/userSchema"

import z from "zod"
import RegisterForm from "./_component/RegisterForm"
import BackBtn from "./_component/BackBtn"


function page() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="p-4">
                <BackBtn />
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-md ">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default page;