import React, { useState } from "react";
import { getGroundById, updateGround } from "../../api/groundApi";

function UpdateGround() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [available, setAvailable] = useState(true);
  const [images, setImages] = useState([""]);
  const [message, setMessage] = useState("");
  const [groundFetched, setGroundFetched] = useState(false);

  // Fetch ground details
  const fetchGround = async () => {
    if (!id) return setMessage("⚠️ Enter ground ID");
    try {
      const g = await getGroundById(parseInt(id));
      setName(g.name);
      setLocation(g.location);
      setPricePerHour(g.pricePerHour);
      setAvailable(g.available);
      setImages(g.images && g.images.length > 0 ? g.images : [""]);
      setMessage("");
      setGroundFetched(true);
    } catch (err) {
      console.error(err);
      setMessage("❌ Ground not found");
      setName("");
      setLocation("");
      setPricePerHour("");
      setAvailable(true);
      setImages([""]);
      setGroundFetched(false);
    }
  };

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      location,
      pricePerHour: parseFloat(pricePerHour),
      available,
      images: images.filter(url => url.trim() !== "")
    };

    try {
      await updateGround(parseInt(id), payload);
      setMessage("✅ Ground updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update ground");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Update Ground</h2>

            {message && <div className="alert alert-info text-center">{message}</div>}

            <div className="mb-3">
              <label className="form-label">Ground ID</label>
              <input
                type="number"
                className="form-control"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="Enter Ground ID"
              />
              <button className="btn btn-secondary mt-2 w-100" onClick={fetchGround}>
                Fetch Ground
              </button>
            </div>

            {groundFetched && (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Price Per Hour</label>
                  <input
                    type="number"
                    className="form-control"
                    value={pricePerHour}
                    onChange={e => setPricePerHour(e.target.value)}
                    required
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={available}
                    onChange={e => setAvailable(e.target.checked)}
                  />
                  <label className="form-check-label">Available</label>
                </div>

                <div className="mb-3">
                  <label>Images (URLs)</label>
                  {images.map((img, index) => (
                    <div key={index} className="d-flex mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={img}
                        onChange={e => handleImageChange(index, e.target.value)}
                        placeholder="Enter image URL"
                      />
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => removeImageField(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary w-100" onClick={addImageField}>
                    Add Another Image
                  </button>
                </div>

                <button type="submit" className="btn btn-warning w-100">
                  Update Ground
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGround;
