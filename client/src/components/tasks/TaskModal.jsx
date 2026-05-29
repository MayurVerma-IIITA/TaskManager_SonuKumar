import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiFieldErrors } from "../../api/axios.js";
import Spinner from "../ui/Spinner.jsx";

const defaultValues = {
  title: "",
  description: "",
  stage: "TODO"
};

const TaskModal = ({ open, task, onClose, onCreate, onUpdate }) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(task);

  useEffect(() => {
    if (open) {
      setValues(
        task
          ? {
              title: task.title,
              description: task.description || "",
              stage: task.stage
            }
          : defaultValues
      );
      setErrors({});
    }
  }, [open, task]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      stage: values.stage
    };

    try {
      if (isEditing) {
        await onUpdate(task.id, payload);
      } else {
        await onCreate(payload);
      }
    } catch (error) {
      setErrors(getApiFieldErrors(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-950">
            {isEditing ? "Edit task" : "Add task"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              maxLength={140}
              required
            />
            {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
          </div>

          <div>
            <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              maxLength={1000}
            />
            {errors.description ? (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="task-stage" className="mb-1 block text-sm font-medium text-slate-700">
              Stage
            </label>
            <select
              id="task-stage"
              name="stage"
              value={values.stage}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            {errors.stage ? <p className="mt-1 text-sm text-red-600">{errors.stage}</p> : null}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex min-w-28 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <Spinner size="sm" className="border-white/40 border-t-white" />
              ) : isEditing ? (
                "Save"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
