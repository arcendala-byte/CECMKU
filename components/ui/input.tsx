import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm transition-colors placeholder:text-[#667085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 disabled:opacity-50",
        error ? "border-[#DC2626]" : "border-[#E5E7EB]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";