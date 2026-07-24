import React, { useEffect, useState } from "react";
import { getUser } from "../../utils/auth";
import { getUserBookings } from "../../api/bookingApi";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading)
    return (
      <div className="text-center mt-5 pt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading your bookings...</p>
      </div>
    );

  if (!bookings.length)
    return (
      <div className="text-center mt-5 pt-5">
        <h4 className="text-muted">No bookings found</h4>
        <p className="text-muted">Start booking your favorite grounds.</p>
      </div>
    );

  return (
    <div className="container mt-5 pt-5 mb-5">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">My Bookings</h2>
        <p className="text-muted">
          Here you can view all your confirmed and pending bookings
        </p>
      </div>

      {/* Card */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Ground</th>
                  <th>Date</th>
                  <th>Time Slots</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((b, index) => (
                  <tr key={b.bookingId}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td className="fw-semibold">{b.groundName}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.bookedSlots?.join(", ")}</td>
                    <td className="fw-bold text-primary">₹{b.totalPrice}</td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          b.status === "CONFIRMED"
                            ? "bg-success"
                            : b.status === "CANCELLED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link rounded-pill px-3"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link rounded-pill mx-1"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link rounded-pill px-3"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
