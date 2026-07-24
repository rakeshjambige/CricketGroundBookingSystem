import axios from "axios";

const BASE_URL = "http://localhost:9090/api/userauth"; // your backend auth service

export const login = async (data) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  return res.data;
};
