import { ComponentProps } from "react";
import clsx from "clsx";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
        className
      )}
      {...props}
    />
  );
}
