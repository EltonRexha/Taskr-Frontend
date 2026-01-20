"use client";

import RegisterForm from "../../../../features/auth/components/RegisterForm";
import BackBtn from "../../../../features/auth/components/BackBtn";

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
  );
}

export default page;
