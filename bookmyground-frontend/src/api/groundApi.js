import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:9191/api/grounds";

// Auth headers (for admin/user)
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// Helper to handle errors
const handleError = (err) => {
  if (err.response) {
    // Backend responded with a status code outside 2xx
    console.error("Backend error:", err.response.data);
    throw new Error(err.response.data.message || JSON.stringify(err.response.data));
  } else if (err.request) {
    // Request was made but no response received
    console.error("No response from server:", err.request);
    throw new Error("No response from server");
  } else {
    // Something else went wrong
    console.error("Error:", err.message);
    throw new Error(err.message);
  }
};

// ADD ground (ADMIN)
export const addGround = async (ground) => {
  try {
    const res = await axios.post(`${BASE_URL}/addGround`, ground, authConfig());
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// GET by id
export const getGroundById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/findGroundById/${id}`, authConfig());
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// UPDATE
export const updateGround = async (id, ground) => {
  try {
    const res = await axios.put(`${BASE_URL}/updateGroundById/${id}`, ground, authConfig());
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// DELETE
export const deleteGround = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deleteGroundById/${id}`, authConfig());
  } catch (err) {
    handleError(err);
  }
};

// GET ALL (for logged-in users)
export const getAllGrounds = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getAllGrounds`, authConfig());
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ✅ GET ALL (public / guest)
export const getAllGroundsPublic = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getAllGrounds`); // no auth header
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
