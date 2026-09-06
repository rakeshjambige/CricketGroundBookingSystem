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

  // =========================================================
  // BOOKING DATE RANGE
  // =========================================================

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Maximum booking date = 90 days from today
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  const maxBookingDate = maxDate.toISOString().split("T")[0];

  const [date, setDate] = useState(today);

  const [bookings, setBookings] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [index, setIndex] = useState(0);

  // =========================================================
  // GENERATE 1-HOUR SLOTS FROM 6 AM TO 1 AM
  // =========================================================

  const hours = [];

  for (let i = 6; i !== 1; i = (i + 1) % 24) {
    const startHour = i;
    const endHour = (i + 1) % 24;

    const formatHour = (h) => {
      if (h === 0) return 12;
      if (h > 12) return h - 12;
      return h;
    };

    const startSuffix = startHour < 12 ? "AM" : "PM";
    const endSuffix = endHour < 12 ? "AM" : "PM";

    hours.push(
      `${formatHour(startHour)} ${startSuffix} - ${formatHour(
        endHour
      )} ${endSuffix}`
    );
  }

  // =========================================================
  // FETCH GROUND DETAILS
  // =========================================================

  useEffect(() => {
    const fetchGround = async () => {
      try {
        const data = await getGroundById(id);
        setGround(data);
      } catch (err) {
        console.error("Error fetching ground:", err);
      }
    };

    fetchGround();
  }, [id]);

  // =========================================================
  // FETCH BOOKED SLOTS
  // =========================================================

  const fetchSlots = async () => {
    if (!ground?.id) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://44.192.87.4:8081/api/bookings/slots/${ground.id}?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [ground?.id, date]);

  // =========================================================
  // CHECK WHETHER SLOT IS IN THE PAST
  // =========================================================

  const isPastSlot = (slot) => {
    // Only check time if selected date is today
    if (date !== today) {
      return false;
    }

    // Example:
    // "6 AM - 7 AM"
    const startTime = slot.split(" - ")[0];

    const parts = startTime.split(" ");

    const time = parts[0];
    const period = parts[1];

    let hour;
    let minute = 0;

    // Handle formats like 6:30 AM if needed
    if (time.includes(":")) {
      const timeParts = time.split(":");

      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);
    } else {
      hour = parseInt(time, 10);
    }

    // Convert PM to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    // Convert 12 AM to 00
    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const now = new Date();

    // Create today's slot start time
    const slotTime = new Date();

    slotTime.setHours(hour);
    slotTime.setMinutes(minute);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    return slotTime <= now;
  };

  // =========================================================
  // GET SLOT STATUS
  // =========================================================

  const getSlotStatus = (slot) => {
    // Already booked
    if (bookings.includes(slot)) {
      return "Booked";
    }

    // Past time slot for today
    if (isPastSlot(slot)) {
      return "Past";
    }

    // Selected by current user
    if (selectedSlots.includes(slot)) {
      return "Selected";
    }

    // Available
    return "Vacant";
  };

  // =========================================================
  // HANDLE SLOT CLICK
  // =========================================================

  const handleSlotClick = (slot) => {
    const status = getSlotStatus(slot);

    // Do not allow booked or past slots
    if (status === "Booked" || status === "Past") {
      return;
    }

    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  // =========================================================
  // HANDLE DATE CHANGE
  // =========================================================

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    // Past date protection
    if (selectedDate < today) {
      alert("You cannot select a past date.");
      return;
    }

    // Maximum booking date protection
    if (selectedDate > maxBookingDate) {
      alert("You can book only up to 90 days in advance.");
      return;
    }

    setDate(selectedDate);

    // Clear selected slots when date changes
    setSelectedSlots([]);
  };

  // =========================================================
  // CONFIRM BOOKING
  // =========================================================

  const handleConfirmBooking = async () => {
    // Prevent double-click
    if (bookingLoading) {
      return;
    }

    // Check login
    if (!user) {
      alert("Please login to book");
      navigate("/login");
      return;
    }

    // Check ground
    if (!ground) {
      alert("Ground information is not available");
      return;
    }

    // Check selected slots
    if (selectedSlots.length === 0) {
      alert("Select at least one slot");
      return;
    }

    // Extra frontend date validation
    if (date < today) {
      alert("Cannot book a past date");
      return;
    }

    // Extra maximum-date validation
    if (date > maxBookingDate) {
      alert("You can book only up to 90 days in advance");
      return;
    }

    // Extra frontend time validation
    const pastSelectedSlot = selectedSlots.some((slot) =>
      isPastSlot(slot)
    );

    if (pastSelectedSlot) {
      alert("One or more selected time slots have already passed");
      return;
    }

    try {
      setBookingLoading(true);

      await axios.post(
        "http://44.192.87.4:8081/api/bookings",
        {
          userId: user.id,
          groundId: ground.id,
          bookingDate: date,
          slots: selectedSlots,
          totalPrice:
            selectedSlots.length * ground.pricePerHour,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("Booking confirmed!");

      // Clear selected slots
      setSelectedSlots([]);

      // Refresh booked slots
      await fetchSlots();
    } catch (err) {
      console.error("Booking failed:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Booking failed";

      alert(message);
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!ground) {
    return (
      <p className="text-center mt-5 pt-5">
        Loading ground...
      </p>
    );
  }

  // =========================================================
  // IMAGES
  // =========================================================

  const images = ground.images?.length
    ? ground.images
    : [
        "https://source.unsplash.com/800x500/?sports,ground",
      ];

  const prevImage = () => {
    setIndex(
      (i) => (i - 1 + images.length) % images.length
    );
  };

  const nextImage = () => {
    setIndex(
      (i) => (i + 1) % images.length
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="container mt-5 pt-5 mb-5">

      {/* =====================================================
          IMAGE SLIDER
      ====================================================== */}

      <div
        className="card shadow mb-4 position-relative ground-image-card"
        style={{ height: "450px" }}
      >
        <img
          src={images[index]}
          alt={ground.name}
          className="w-100 rounded"
          style={{
            height: "100%",
            objectFit: "cover",
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* =====================================================
          GROUND DETAILS + BOOKING
      ====================================================== */}

      <div className="card shadow p-4 booking-card">

        <h3>{ground.name}</h3>

        <p>
          <strong>Type:</strong>{" "}
          {ground.type || "Sports Venue"}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {ground.location}
        </p>

        <p>
          <strong>Timing:</strong>{" "}
          6 AM - 1 AM
        </p>

        <p>
          <strong>Price per Hour:</strong>{" "}
          ₹{ground.pricePerHour}
        </p>

        <p>
          <strong>Facilities:</strong>{" "}
          Parking, Washroom, Drinking Water, Lights
        </p>

        <hr />

        <h5>Book Slots</h5>

        {/* ===================================================
            DATE SELECTION
        ==================================================== */}

        <div className="mb-3">

          <label className="form-label">
            Date:
          </label>

          <input
            type="date"
            className="form-control"
            min={today}
            max={maxBookingDate}
            value={date}
            onChange={handleDateChange}
          />

          <small className="text-muted">
            You can book from today up to{" "}
            {maxBookingDate}.
          </small>

        </div>

        {/* ===================================================
            SLOT DISPLAY
        ==================================================== */}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="d-flex flex-wrap booking-slots">

            {hours.map((h) => {

              const status = getSlotStatus(h);

              return (
                <div
                  key={h}
                  className="booking-slot"
                  onClick={() =>
                    handleSlotClick(h)
                  }
                  style={{
                    minWidth: "110px",
                    padding: "10px",
                    margin: "5px",
                    textAlign: "center",
                    borderRadius: "5px",

                    cursor:
                      status === "Booked" ||
                      status === "Past"
                        ? "not-allowed"
                        : "pointer",

                    backgroundColor:
                      status === "Booked"
                        ? "#dc3545"
                        : status === "Past"
                        ? "#6c757d"
                        : status === "Selected"
                        ? "#0dcaf0"
                        : "#198754",

                    color: "white",
                    fontWeight: "bold",

                    opacity:
                      status === "Past"
                        ? 0.6
                        : 1,
                  }}
                >
                  {h}

                  <br />

                  {status}
                </div>
              );
            })}

          </div>
        )}

        {/* ===================================================
            CONFIRM BOOKING
        ==================================================== */}

        <div className="mt-3 text-end">

          <button
            className="btn btn-success"
            onClick={handleConfirmBooking}
            disabled={
              selectedSlots.length === 0 ||
              bookingLoading
            }
          >
            {bookingLoading
              ? "Processing..."
              : "Confirm Booking"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Grounds;
