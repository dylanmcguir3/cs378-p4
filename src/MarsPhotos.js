import React, { useState } from "react";
import "./MarsPhotos.css";

const MarsPhotos = () => {
  const [rover, setRover] = useState("curiosity");
  const [sol, setSol] = useState("1000");
  const [camera, setCamera] = useState("all");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    const API_KEY = "0uGZXH8OPWcFcUGR7BwezWXzBKFhB845A5wmqqQJ";
    let API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${API_KEY}`;

    if (sol) {
      API_URL += `&sol=${sol}`;
    }

    if (camera !== "all") {
      API_URL += `&camera=${camera}`;
    } else {
      console.log("API_URL: ", API_URL);
      console.log("API_URL: ", API_URL.split("&camera=")[0]);
      API_URL = API_URL.split("&camera=")[0];
    }

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.photos.length === 0) {
        setError("No photos found for the selected criteria.");
      } else {
        setPhotos(data.photos);
      }
    } catch (err) {
      setError("Failed to fetch photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sol) {
      setError("Please enter a Martian sol.");
      return;
    }
    fetchPhotos();
  };

  return (
    <div className="mars-photos-app">
      <h1>Mars Rover Photos</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Select Rover:
          <select value={rover} onChange={(e) => setRover(e.target.value)}>
            <option value="curiosity">Curiosity</option>
            <option value="opportunity">Opportunity</option>
            <option value="spirit">Spirit</option>
          </select>
        </label>
        <label>
          Martian Sol:
          <input
            type="number"
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            placeholder="e.g., 1000"
          />
        </label>
        <label>
          Select Camera:
          <select value={camera} onChange={(e) => setCamera(e.target.value)}>
            <option value="all">All</option>
            <option value="fhaz">Front Hazard Avoidance Camera</option>
            <option value="rhaz">Rear Hazard Avoidance Camera</option>
            <option value="navcam">Navigation Camera</option>
            <option value="pancam">Panoramic Camera</option>
            <option value="mast">Mast Camera</option>
            <option value="chemcam">Chemistry and Camera Complex</option>
            <option value="mahli">Mars Hand Lens Imager</option>
            <option value="mardi">Mars Descent Imager</option>
            <option value="minites">
              Miniature Thermal Emission Spectrometer (Mini-TES)
            </option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch Photos"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="photo-gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.img_src}
              alt={`Mars Rover ${photo.rover.name}`}
              className="photo"
            />
            <div className="photo-info">
              <p>
                <strong>Rover:</strong> {photo.rover.name}
              </p>
              <p>
                <strong>Camera:</strong> {photo.camera.full_name}
              </p>
              <p>
                <strong>Sol:</strong> {photo.sol}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarsPhotos;
