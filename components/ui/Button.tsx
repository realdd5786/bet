import { ComponentProps } from "react";
import clsx from "clsx";

export function Button({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-60",
        "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 text-black shadow-glow hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  );
}
