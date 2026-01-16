import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import LoginForm from "../../../../features/auth/components/LoginForm"

function page() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="p-4">
                <Link href="/">
                    <Button variant="outline" className="px-4 py-2 inline-flex items-center gap-2 cursor-pointer">
                        <ArrowLeft size={20} />
                        Back
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-md ">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default page;