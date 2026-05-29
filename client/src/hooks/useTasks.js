import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios.js";
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksRequest,
  updateTaskRequest
} from "../api/tasks.js";

const stages = ["TODO", "IN_PROGRESS", "DONE"];

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const nextTasks = await fetchTasksRequest();
      setTasks(nextTasks);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to load tasks");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload) => {
    try {
      const task = await createTaskRequest(payload);
      setTasks((current) => [task, ...current]);
      toast.success("Task created");
      return task;
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to create task"));
      throw requestError;
    }
  };

  const updateTask = async (id, payload, options = {}) => {
    const previousTasks = tasks;

    if (options.optimistic) {
      setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, ...payload } : task))
      );
    }

    try {
      const updatedTask = await updateTaskRequest(id, payload);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task))
      );

      if (!options.silent) {
        toast.success("Task updated");
      }

      return updatedTask;
    } catch (requestError) {
      if (options.optimistic) {
        setTasks(previousTasks);
      }

      const message = getApiErrorMessage(requestError, "Unable to update task");
      toast.error(message);
      throw requestError;
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      toast.success("Task deleted");
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to delete task"));
      throw requestError;
    }
  };

  const tasksByStage = useMemo(() => {
    return stages.reduce((grouped, stage) => {
      grouped[stage] = tasks.filter((task) => task.stage === stage);
      return grouped;
    }, {});
  }, [tasks]);

  return {
    tasks,
    tasksByStage,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};
