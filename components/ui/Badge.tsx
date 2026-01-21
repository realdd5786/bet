import { ComponentProps } from "react";
import clsx from "clsx";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={clsx(
        "rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white",
        className
      )}
      {...props}
    />
  );
}
