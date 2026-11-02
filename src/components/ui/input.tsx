import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10.5 w-full rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 py-2 text-[13px] text-[#191F28] shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-[13px] file:font-medium placeholder:text-[#B0B8C1] focus-visible:outline-hidden focus-visible:border-[#3182F6] focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
