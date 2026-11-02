import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-hidden select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#3182F6] text-white",
        brand:
          "bg-[#E8F3FF] text-[#3182F6]",
        secondary:
          "bg-[#F2F4F6] text-[#4E5968]",
        success:
          "bg-[#E8F8F0] text-[#2B9D5B]",
        warning:
          "bg-[#FFF4E5] text-[#FF8A00]",
        danger:
          "bg-[#FFF0F2] text-[#F04452]",
        outline:
          "border border-[#E5E8EB] text-[#4E5968] bg-white",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
