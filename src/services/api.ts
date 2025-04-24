import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users"; // Updated to match Express server

export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addUser = async (name: string, email: string) => {
  const response = await axios.post(`${API_URL}/add/`, { name, email });
  return response.data;
};
