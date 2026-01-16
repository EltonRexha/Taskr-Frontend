import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function HandleCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        await handleRedirectCallback({});
        router.push("/");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to complete authentication. Please try again.");
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      }
    }

    handleCallback();
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-gray-600 animate-pulse">Authenticating</p>
      </div>
    </div>
  );
}

export default HandleCallback;
