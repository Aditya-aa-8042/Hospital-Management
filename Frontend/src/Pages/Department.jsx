import { useState, useEffect } from "react";
import Navbar from "../Component/Navbar";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/departments`);
        const text = await res.text();
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        if (!res.ok) {
          throw new Error(data.message || `Request failed (status ${res.status})`);
        }
        setDepartments(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-6 py-20'>
        <h1 className='text-4xl md:text-6xl font-bold leading-tight text-blue-600 mb-8'>Departments</h1>
        <p className='text-lg text-gray-700 mb-12'>
          Our hospital offers a wide range of specialized departments to cater to the diverse healthcare needs of our patients. Each department is staffed with experienced medical professionals and equipped with state-of-the-art facilities to provide the highest quality care.
        </p>

        {loading && <p className="text-gray-500">Loading departments...</p>}

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</p>
        )}

        {!loading && !error && departments.length === 0 && (
          <p className="text-gray-500">No departments found.</p>
        )}

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {departments.map((dept) => (
            <div
              key={dept._id}
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'
            >
              <h2 className='text-xl font-semibold text-blue-600 mb-4'>{dept.name}</h2>
              <p className='text-gray-700'>{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Department;
