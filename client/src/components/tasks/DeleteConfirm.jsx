import { useState } from "react";
import Spinner from "../ui/Spinner.jsx";

const DeleteConfirm = ({ open, title, onClose, onConfirm }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const handleConfirm = async () => {
    setSubmitting(true);

    try {
      await onConfirm();
    } catch {
      // The task hook surfaces API failures through toasts.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-950">Delete task?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This will permanently remove <span className="font-semibold text-slate-900">{title}</span>.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex min-w-24 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Spinner size="sm" className="border-white/40 border-t-white" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
