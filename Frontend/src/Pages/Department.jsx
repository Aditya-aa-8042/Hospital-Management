// import Navbar from '../Component/Navbar'

// const Department = () => {
//   return (
//     <div className='bg-gray-50 min-h-screen'>   
//       <Navbar />
//       <div className='max-w-7xl mx-auto px-6 py-20'>
//         <h1 className='text-4xl md:text-6xl font-bold leading-tight text-blue-600 mb-8'>Departments</h1>
//         <p className='text-lg text-gray-700 mb-12'>
//           Our hospital offers a wide range of specialized departments to cater to the diverse healthcare needs of our patients. Each department is staffed with experienced medical professionals and equipped with state-of-the-art facilities to provide the highest quality care.
//         </p>
//         <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
//           <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
//             <h2 className='text-xl font-semibold text-blue-600 mb-4'>Cardiology</h2>
//             <p className='text-gray-700'>           
//                 Our Cardiology department specializes in the diagnosis and treatment of heart-related conditions. Our team of cardiologists is dedicated to providing comprehensive care for patients with cardiovascular diseases.
//             </p>
//           </div>
//           <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
//             <h2 className='text-xl font-semibold text-blue-600 mb-4'>Neurology</h2>
//             <p className='text-gray-700'>
//                 The Neurology department focuses on the diagnosis and management of neurological disorders. Our neurologists are skilled in treating conditions such as epilepsy, stroke, and neurodegenerative diseases.   
//             </p>
//             </div>
//             <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
//             <h2 className='text-xl font-semibold text-blue-600 mb-4'>Orthopedics</h2>
//             <p className='text-gray-700'>
//                 Our Orthopedics department provides comprehensive care for musculoskeletal conditions. Our orthopedic surgeons specialize in joint replacement, sports injuries, and fracture management.
//             </p>
//             </div>
//             <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
//             <h2 className='text-xl font-semibold text-blue-600 mb-4'>Pediatrics</h2>
//             <p className='text-gray-700'>
//                 The Pediatrics department is dedicated to the health and well-being of children. Our pediatricians provide preventive care, vaccinations, and treatment for various childhood illnesses.
//             </p>    
//         </div>
//         <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
//             <h2 className='text-xl font-semibold text-blue-600 mb-4'>Oncology</h2>
//             <p className='text-gray-700'>
//                 The Oncology department is committed to providing comprehensive cancer care. Our oncologists work closely with other specialists to develop personalized treatment plans for each patient.
//             </p>
//         </div>
//         </div>
//         </div>
//     </div>
//   )
// }

// export default Department;
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
        const res = await fetch(`${API_URL}/api/department`);
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