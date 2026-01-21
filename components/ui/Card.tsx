import { ComponentProps } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
