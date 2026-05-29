import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard.jsx";

const SkeletonCards = () => (
  <div className="space-y-3">
    {[0, 1, 2].map((item) => (
      <div key={item} className="rounded-xl border border-white bg-white p-4 shadow-sm">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
    ))}
  </div>
);

const KanbanColumn = ({ column, tasks, loading, onEditTask, onDeleteTask }) => {
  return (
    <div className={`flex min-h-[28rem] w-[19rem] shrink-0 flex-col rounded-xl border p-3 sm:w-[21rem] md:w-auto md:min-w-0 ${column.className}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">{column.title}</h3>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          {tasks.length}
        </span>
      </div>

      {loading ? (
        <SkeletonCards />
      ) : (
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex flex-1 flex-col gap-3 rounded-lg transition ${
                snapshot.isDraggingOver ? "bg-white/70" : ""
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
              {provided.placeholder}
              {!tasks.length ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/55 p-6 text-center text-sm text-slate-500">
                  No tasks here yet
                </div>
              ) : null}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default KanbanColumn;
