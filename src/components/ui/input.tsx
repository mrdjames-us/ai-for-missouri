import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md bg-paper px-3.5 text-base text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-ring)] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
