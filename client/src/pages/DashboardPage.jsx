import { useState } from "react";
import KanbanBoard from "../components/tasks/KanbanBoard.jsx";
import TaskModal from "../components/tasks/TaskModal.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";

const DashboardPage = () => {
  const taskActions = useTasks();
  const [modalState, setModalState] = useState({ open: false, task: null });

  const openCreateModal = () => setModalState({ open: true, task: null });
  const openEditModal = (task) => setModalState({ open: true, task });
  const closeModal = () => setModalState({ open: false, task: null });

  const handleCreate = async (payload) => {
    await taskActions.createTask(payload);
    closeModal();
  };

  const handleUpdate = async (id, payload) => {
    await taskActions.updateTask(id, payload);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onAddTask={openCreateModal} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <KanbanBoard {...taskActions} onEditTask={openEditModal} />
      </main>

      <TaskModal
        open={modalState.open}
        task={modalState.task}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default DashboardPage;
