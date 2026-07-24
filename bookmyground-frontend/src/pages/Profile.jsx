import React from "react";
import { getUser } from "../utils/auth";

function Profile() {
  const user = getUser();

  if (!user) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h4>No user logged in</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">My Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {user.role === "ADMIN" && (
          <div className="alert alert-info mt-3">
            You are an Admin. You can manage grounds.
          </div>
        )}

        {user.role === "USER" && (
          <div className="alert alert-success mt-3">
            You are a User. You can book grounds.
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
