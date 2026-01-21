import { ReactNode } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            className={clsx(
              "rounded-full border border-white/10 px-3 py-1 text-xs text-white/70",
              "hover:border-white/30"
            )}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
        <div className="mt-4 text-sm text-white/80">{children}</div>
      </div>
    </div>
  );
}
