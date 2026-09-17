import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-forest-deep",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline:
          "bg-transparent text-foreground ring-1 ring-border hover:bg-paper",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
        inverse: "bg-paper text-forest hover:bg-cream",
        brick: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        default: "h-11 px-5 rounded-md text-sm",
        sm: "h-9 px-3.5 rounded-sm text-sm",
        lg: "h-12 px-6 rounded-lg text-base",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
