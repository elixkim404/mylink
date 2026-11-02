import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Toss Design System (TDS) Button Specification
 * - Primary: Toss Blue (#3182F6), Pressed: #1B64DA
 * - Secondary: Grey 100 (#F2F4F6), Text: Grey 700 (#4E5968)
 * - Radius: L (14px, 48px height), XL (16px, 56px height)
 * - Micro-interaction: active:scale-[0.98] transition-transform duration-100 ease-out
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-100 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-30 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-[#3182F6]/40",
  {
    variants: {
      variant: {
        default:
          "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:scale-[0.98] shadow-xs",
        secondary:
          "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB] hover:text-[#191F28] active:scale-[0.98]",
        outline:
          "border border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F9FAFB] hover:border-[#D1D6DB] active:scale-[0.98] shadow-xs",
        ghost:
          "text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28] active:scale-[0.98]",
        brandWeak:
          "bg-[#E8F3FF] text-[#3182F6] hover:bg-[#D4E8FF] active:scale-[0.98]",
        danger:
          "bg-[#FFF0F2] text-[#F04452] hover:bg-[#FFE0E4] active:scale-[0.98]",
        link: "text-[#3182F6] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-11 px-4 py-2.5 rounded-[12px] text-[14px]",
        sm: "h-8.5 px-3 rounded-[10px] text-[12px]",
        lg: "h-12 px-5 rounded-[14px] text-[15px] font-semibold", // TDS L button (48px, radius 14px)
        xl: "h-14 px-6 rounded-[16px] text-[16px] font-bold", // TDS XL button (56px, radius 16px)
        icon: "h-9 w-9 rounded-full p-0 shrink-0",
        iconSm: "h-8 w-8 rounded-[10px] p-0 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
