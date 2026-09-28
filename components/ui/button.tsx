import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-tight transition-[transform,background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:opacity-90",
        gradient:
          "bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_12px_40px_-16px_rgba(139,92,246,0.9)] hover:brightness-110",
        ghost: "glass hover:bg-muted",
        quiet: "bg-transparent text-foreground hover:bg-muted",
      },
      size: {
        md: "h-12 px-6",
        sm: "h-10 px-4 text-[13px]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
