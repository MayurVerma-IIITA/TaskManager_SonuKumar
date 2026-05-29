import { Draggable } from "@hello-pangea/dnd";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirm from "./DeleteConfirm.jsx";

const stageLabels = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done"
};

const stageClasses = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700"
};

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <article
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md ${
              snapshot.isDragging ? "rotate-1 shadow-lg" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="break-words text-sm font-semibold text-slate-950">{task.title}</h4>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-700"
                  aria-label="Edit task"
                  title="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete task"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {task.description ? (
              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-slate-600">
                {task.description}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stageClasses[task.stage]}`}>
                {stageLabels[task.stage]}
              </span>
              <time className="text-xs text-slate-400" dateTime={task.updatedAt}>
                {new Date(task.updatedAt).toLocaleDateString()}
              </time>
            </div>
          </article>
        )}
      </Draggable>

      <DeleteConfirm
        open={confirmOpen}
        title={task.title}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await onDelete();
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

export default TaskCard;
