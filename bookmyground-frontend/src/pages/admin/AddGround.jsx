import React, { useState } from "react";
import { addGround } from "../../api/groundApi";

function AddGround() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [available, setAvailable] = useState(true);
  const [images, setImages] = useState([""]); // array of URLs
  const [message, setMessage] = useState("");

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGround({
        name,
        location,
        pricePerHour: parseFloat(pricePerHour),
        available,
        images: images.filter(img => img.trim() !== "")
      });

      setMessage("✅ Ground added successfully!");
      setName("");
      setLocation("");
      setPricePerHour("");
      setAvailable(true);
      setImages([""]);
    } catch (err) {
      console.error("AddGround error:", err);
      setMessage("❌ Failed to add ground. Check console.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Add Ground</h2>

            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Ground Name</label>
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
                <label>Image URLs</label>
                {images.map((img, index) => (
                  <div key={index} className="d-flex mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={img}
                      placeholder="Enter image URL"
                      onChange={e => handleImageChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => removeImageField(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-primary w-100" onClick={addImageField}>
                  Add Another Image
                </button>
              </div>

              <button type="submit" className="btn btn-success w-100">Add Ground</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddGround;
