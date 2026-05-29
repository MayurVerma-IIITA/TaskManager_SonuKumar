import api from "./axios.js";

export const fetchTasksRequest = async () => {
  const response = await api.get("/api/tasks");
  return response.data.tasks;
};

export const createTaskRequest = async (payload) => {
  const response = await api.post("/api/tasks", payload);
  return response.data.task;
};

export const updateTaskRequest = async (id, payload) => {
  const response = await api.put(`/api/tasks/${id}`, payload);
  return response.data.task;
};

export const deleteTaskRequest = async (id) => {
  await api.delete(`/api/tasks/${id}`);
};
