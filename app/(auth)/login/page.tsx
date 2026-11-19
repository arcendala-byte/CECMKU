import Link from "next/link";
import { LoginForm } from "./login-form";
import { ReturnHomeButton } from "@/components/layout/return-home-button";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <ReturnHomeButton />
      </div>
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="h-16 w-16 mb-4">
          <img src="/images/logo.png" alt="CECMKU Logo" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-2xl font-semibold text-[#0B1930]">CECMKU Portal</h1>
        <p className="mt-1 text-sm text-[#667085] font-medium text-center">
          Communauté des Étudiants Congolais à MKU
        </p>
        <p className="mt-3 text-sm text-[#667085]">
          Sign in to participate in the community election
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
        <LoginForm />
      </div>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-[#667085]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#2563EB] hover:underline font-medium">
            Request Access
          </Link>
        </p>
        <p className="text-sm text-[#667085]">
          Need help?{" "}
          <Link href="/contact" className="text-[#2563EB] hover:underline font-medium">
            Contact the committee
          </Link>
        </p>
      </div>
    </div>
  );
}
