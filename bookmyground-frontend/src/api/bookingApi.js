import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const BASE_URL = "http://44.192.87.4:8081/api/bookings";


const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});



// ================= CREATE BOOKING =================

export const createBooking = async (booking) => {

  const res = await axios.post(
    `${BASE_URL}`,
    booking,
    authConfig()
  );

  return res.data;
};




// ================= GET LOGGED-IN USER BOOKINGS =================

export const getUserBookings = async () => {

  const user = getUser();

  if (!user) {
    throw new Error("User not logged in");
  }


  const res = await axios.get(
    `${BASE_URL}/user/${user.id}`,
    authConfig()
  );


  return res.data;
};





// ================= GET BOOKED SLOTS BY GROUND AND DATE =================

export const getBookingsByGround = async (groundId, date) => {


  const res = await axios.get(
    `${BASE_URL}/slots/${groundId}?date=${date}`,
    authConfig()
  );


  return res.data;
};
