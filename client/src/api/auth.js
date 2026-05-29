import api from "./axios.js";

export const registerRequest = async (payload) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};

export const loginRequest = async (payload) => {
  const response = await api.post("/api/auth/login", payload);
  return response.data;
};

export const getMeRequest = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
