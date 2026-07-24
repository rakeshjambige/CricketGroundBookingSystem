import React, { useEffect, useState } from "react";
import { getAllGrounds } from "../../api/groundApi";
import axios from "axios";
import { getToken } from "../../utils/auth";

function TotalGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [slotsInfo, setSlotsInfo] = useState({}); // store total/booked/vacant counts

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const data = await getAllGrounds();
        setGrounds(data);

        const slotsData = {};
        for (let g of data) {
          const res = await axios.get(
            `http://localhost:8081/api/bookings/slots/${g.id}?date=${new Date().toISOString().split("T")[0]}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
          );
          const booked = res.data.length;
          const total = 19; // total slots from 6 AM to 1 AM
          slotsData[g.id] = { total, booked, vacant: total - booked };
        }
        setSlotsInfo(slotsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGrounds();
  }, []);

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">All Grounds</h2>

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Price Per Hour</th>
                <th>Available</th>
                <th>Total Slots</th>
                <th>Booked Slots</th>
                <th>Vacant Slots</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {grounds.map((g) => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.name}</td>
                  <td>{g.location}</td>
                  <td>₹{g.pricePerHour ?? "N/A"}</td>
                  <td>{g.available ? "Yes" : "No"}</td>
                  <td>{slotsInfo[g.id]?.total || 0}</td>
                  <td>{slotsInfo[g.id]?.booked || 0}</td>
                  <td>{slotsInfo[g.id]?.vacant || 0}</td>
                  <td>
                    <img
                      src={g.images?.[0] || "https://source.unsplash.com/100x60/?cricket,stadium"}
                      alt={g.name}
                      style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TotalGrounds;
