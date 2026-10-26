import { useState, useEffect } from "react";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

// Loads the diseases list (name, specialist, keywords) from GET /api/diseases.
// The data itself lives only in the backend file utils/diseases.js.
export const useDiseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiseases = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/diseases`);
        const text = await res.text();
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        if (!res.ok) {
          throw new Error(data.message || `Could not load diseases (status ${res.status})`);
        }
        setDiseases(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  return { diseases, loading, error };
};