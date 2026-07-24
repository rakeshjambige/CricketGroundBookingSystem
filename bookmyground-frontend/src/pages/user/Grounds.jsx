import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getToken } from "../../utils/auth";
import axios from "axios";
import { getGroundById } from "../../api/groundApi";

function Grounds() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [ground, setGround] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  // Generate 1-hour slots from 6 AM to 1 AM
  const hours = [];
  for (let i = 6; i !== 1; i = (i + 1) % 24) {
    const startHour = i;
    const endHour = (i + 1) % 24;
    const formatHour = (h) => (h === 0 ? 12 : h > 12 ? h - 12 : h);
    const startSuffix = startHour < 12 || startHour === 24 ? "AM" : "PM";
    const endSuffix = endHour < 12 || endHour === 24 ? "AM" : "PM";
    hours.push(`${formatHour(startHour)} ${startSuffix} - ${formatHour(endHour)} ${endSuffix}`);
  }

  // Fetch ground details
  useEffect(() => {
    const fetchGround = async () => {
      try {
        const data = await getGroundById(id);
        setGround(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGround();
  }, [id]);

 // Fetch booked slots
const fetchSlots = async () => {
  if (!ground?.id) return;

  setLoading(true);

  try {
    const res = await axios.get(
      `http://localhost:8081/api/bookings/slots/${ground.id}?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    setBookings(res.data || []);

  } catch (err) {
    console.error(err);

  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchSlots();
}, [ground?.id, date]);

  const getSlotStatus = (slot) => {
    if (bookings.includes(slot)) return "Booked";
    if (selectedSlots.includes(slot)) return "Selected";
    return "Vacant";
  };

  const handleSlotClick = (slot) => {
    if (getSlotStatus(slot) === "Booked") return;
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      alert("Please login to book");
      navigate("/login");
      return;
    }
    if (selectedSlots.length === 0) {
      alert("Select at least one slot");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8081/api/bookings",
        { userId: user.id, groundId: ground.id, bookingDate: date, slots: selectedSlots, totalPrice: selectedSlots.length * 500 },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert("Booking confirmed!");

setSelectedSlots([]);

// Refresh booked slots immediately
await fetchSlots();
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  if (!ground) return <p className="text-center mt-5 pt-5">Loading ground...</p>;

  const images = ground.images?.length ? ground.images : ["https://source.unsplash.com/800x500/?sports,ground"];
  const prevImage = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="container mt-5 pt-5 mb-5">

      {/* Image Slider */}
      <div className="card shadow mb-4 position-relative" style={{ height: "450px" }}>
        <img
          src={images[index]}
          alt={ground.name}
          className="w-100 rounded"
          style={{ height: "100%", objectFit: "cover" }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: "absolute", top: "50%", left: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)", color: "white",
                border: "none", borderRadius: "50%", width: "40px", height: "40px",
                fontSize: "24px", cursor: "pointer", zIndex: 10
              }}
            >‹</button>
            <button
              onClick={nextImage}
              style={{
                position: "absolute", top: "50%", right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)", color: "white",
                border: "none", borderRadius: "50%", width: "40px", height: "40px",
                fontSize: "24px", cursor: "pointer", zIndex: 10
              }}
            >›</button>
          </>
        )}
      </div>

      {/* Ground Details + Slot Booking */}
      <div className="card shadow p-4">
        <h3>{ground.name}</h3>
        <p><strong>Type:</strong> {ground.type || "Sports Venue"}</p>
        <p><strong>Location:</strong> {ground.location}</p>
        <p><strong>Timing:</strong> 6 AM - 1 AM</p>
        <p><strong>Price per Hour:</strong> ₹{ground.pricePerHour}</p>
        <p><strong>Facilities:</strong> Parking, Washroom, Drinking Water, Lights</p>

        <hr />

        <h5>Book Slots</h5>
        <div className="mb-3">
          <label>Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="d-flex flex-wrap">
            {hours.map(h => (
              <div
                key={h}
                onClick={() => handleSlotClick(h)}
                style={{
                  minWidth: "110px",
                  padding: "10px",
                  margin: "5px",
                  textAlign: "center",
                  borderRadius: "5px",
                  cursor: getSlotStatus(h) === "Booked" ? "not-allowed" : "pointer",
                  backgroundColor: getSlotStatus(h) === "Booked" ? "#dc3545" : getSlotStatus(h) === "Selected" ? "#0dcaf0" : "#198754",
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {h}<br />{getSlotStatus(h)}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-end">
          <button
            className="btn btn-success"
            onClick={handleConfirmBooking}
            
            disabled={selectedSlots.length === 0}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default Grounds;
