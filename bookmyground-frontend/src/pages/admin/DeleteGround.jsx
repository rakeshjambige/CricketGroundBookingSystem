import React, { useState } from "react";
import { deleteGround } from "../../api/groundApi";

function DeleteGround() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!id) {
      setMessage("Please enter a valid Ground ID");
      return;
    }

    try {
      await deleteGround(id);
      setMessage("✅ Ground deleted successfully!");
      setId("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete ground");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Delete Ground</h2>

            {message && (
              <div className="alert alert-info text-center">
                {message}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Ground ID</label>
              <input
                type="number"
                className="form-control"
                value={id}
                placeholder="Enter Ground ID"
                onChange={e => setId(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button
                className="btn btn-danger btn-lg"
                onClick={handleDelete}
              >
                Delete Ground
              </button>
            </div>

            <p className="text-center mt-3 text-muted">
              Enter the ID of the ground you want to delete. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteGround;
