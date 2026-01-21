import clsx from "clsx";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}

export function Toast({ title, description, variant = "info" }: ToastProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-sm shadow-card",
        variant === "success" && "border-emerald-400/40",
        variant === "error" && "border-rose-400/40"
      )}
    >
      <p className="font-semibold text-white">{title}</p>
      {description ? (
        <p className="mt-1 text-white/70">{description}</p>
      ) : null}
    </div>
  );
}
