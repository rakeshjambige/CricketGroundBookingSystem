import React, { useEffect, useState } from "react";
import { getAllGroundsPublic } from "../api/groundApi";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function Home() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser(); // check if someone is logged in

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const data = await getAllGroundsPublic();
        setGrounds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrounds();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading grounds...</p>;
  if (!grounds.length) return <p className="text-center mt-5">No grounds available</p>;

  const handleViewDetails = (id) => {
    if (!user) {
      alert("Please login to view ground details.");
      navigate("/login");
      return;
    }
    navigate(`/ground/${id}`);
  };

  return (
    <div className="container mt-5 pt-4">
      <h3 className="text-center mb-4">Available Grounds</h3>

      <div className="row">
        {grounds.map((ground) => (
          <div key={ground.id} className="col-md-4 mb-4">
            <div className="card shadow h-100 text-center">
              <img
                src={ground.images?.[0] || "https://source.unsplash.com/600x400/?cricket,ground"}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt={ground.name}
              />
              <div className="card-body">
                <h5>{ground.name}</h5>
                <p className="text-muted">{ground.location}</p>
                <p><strong>Price/Hour:</strong> ₹{ground.pricePerHour}</p>
                <p><strong>Available:</strong> {ground.available ? "Yes" : "No"}</p>

                {/* View Details Button */}
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleViewDetails(ground.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
