import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const BASE_URL = "http://localhost:8081/api/bookings"; // adjust port if needed

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// Create a booking
export const createBooking = async (booking) => {
  const res = await axios.post(`${BASE_URL}`, booking, authConfig()); // POST /api/bookings
  return res.data;
};

// Get logged-in user's bookings
export const getUserBookings = async () => {
  const user = getUser();
  if (!user) throw new Error("User not logged in");

  // Use path variable instead of query param
  const res = await axios.get(`${BASE_URL}/user/${user.id}`, authConfig()); 
  return res.data;
};

// Get all bookings for a particular ground
export const getBookingsByGround = async (groundId) => {
  const res = await axios.get(`${BASE_URL}/slots/${groundId}`, authConfig()); 
  return res.data;
};
