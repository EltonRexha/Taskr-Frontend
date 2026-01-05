
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function BackBtn() {
    const router = useRouter();

    return (
        <Button variant="outline" className="px-4 py-2 inline-flex items-center gap-2 cursor-pointer" onClick={() => {
            router.back();
        }}>
            <ArrowLeft size={20} />
            Back
        </Button>
    )
}

export default BackBtn