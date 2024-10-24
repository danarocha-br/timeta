import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormField } from "./form";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <input
      type={type}
      className={cn(
        "text-right peer rounded-full text-text-primary flex h-9 w-full bg-input hover:bg-border hover:ring hover:ring-secondary/60 px-3 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50",
        className,
        error?.message && "bg-rose-300/20"
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
