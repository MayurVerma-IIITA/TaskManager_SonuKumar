import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn.jsx";

const columns = [
  { id: "TODO", title: "Todo", className: "bg-slate-50 border-slate-200" },
  { id: "IN_PROGRESS", title: "In Progress", className: "bg-blue-50 border-blue-100" },
  { id: "DONE", title: "Done", className: "bg-green-50 border-green-100" }
];

const KanbanBoard = ({ tasksByStage, loading, error, updateTask, deleteTask, onEditTask }) => {
  const handleDragEnd = async (result) => {
    const { destination, draggableId, source } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    try {
      await updateTask(
        draggableId,
        { stage: destination.droppableId },
        { optimistic: true, silent: true }
      );
    } catch (error) {
      // The hook already restores state and shows the error toast.
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Move tasks across stages as work progresses.</p>
        </div>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStage[column.id] || []}
              loading={loading}
              onEditTask={onEditTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </section>
  );
};

export default KanbanBoard;
