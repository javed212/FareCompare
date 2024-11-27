import React, { useState } from "react";
import axios from "axios";

const FareComparison = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [lyftFare, setLyftFare] = useState(null);
  const [uberFare, setUberFare] = useState(null);
  const [error, setError] = useState("");

  // Replace with actual Lyft and Uber API URLs and keys
  const LYFT_API_URL = "https://api.lyft.com/v1/cost";
  const UBER_API_URL = "https://api.uber.com/v1.2/estimates/price";
  const LYFT_API_KEY = "YOUR_LYFT_API_KEY";
  const UBER_API_KEY = "YOUR_UBER_API_KEY";

  const fetchFares = async () => {
    setError("");
    setLyftFare(null);
    setUberFare(null);

    try {
      // Example coordinates for simplicity; in production, use geocoding APIs to convert addresses to coordinates
      const pickupCoordinates = { lat: 37.7749, lng: -122.4194 }; // Replace with actual pickup coords
      const destinationCoordinates = { lat: 37.7849, lng: -122.4094 }; // Replace with actual destination coords

      // Fetch Lyft fare
      const lyftResponse = await axios.get(LYFT_API_URL, {
        params: {
          start_lat: pickupCoordinates.lat,
          start_lng: pickupCoordinates.lng,
          end_lat: destinationCoordinates.lat,
          end_lng: destinationCoordinates.lng,
        },
        headers: {
          Authorization: `Bearer ${LYFT_API_KEY}`,
        },
      });
      setLyftFare(lyftResponse.data.cost_estimates[0].estimated_cost_cents_min / 100);

      // Fetch Uber fare
      const uberResponse = await axios.get(UBER_API_URL, {
        params: {
          start_latitude: pickupCoordinates.lat,
          start_longitude: pickupCoordinates.lng,
          end_latitude: destinationCoordinates.lat,
          end_longitude: destinationCoordinates.lng,
        },
        headers: {
          Authorization: `Bearer ${UBER_API_KEY}`,
        },
      });
      setUberFare(uberResponse.data.prices[0].estimate);
    } catch (err) {
      setError("Failed to fetch fare estimates. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lyft vs. Uber Fare Comparison</h2>
      <div>
        <label>Pickup Location:</label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pickup address"
        />
      </div>
      <div>
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination address"
        />
      </div>
      <button onClick={fetchFares} style={{ margin: "10px 0" }}>
        Compare Fares
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {lyftFare !== null && <p>Lyft Fare Estimate: ${lyftFare}</p>}
        {uberFare !== null && <p>Uber Fare Estimate: ${uberFare}</p>}
      </div>
    </div>
  );
};

export default FareComparison;

