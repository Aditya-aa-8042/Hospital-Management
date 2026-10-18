import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedDoctorId = searchParams.get("doctor") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    sex: "",
    phone: "",
    email: "",
    reason: "",
    date: "",
    time: "",
    doctorId: preselectedDoctorId,
  });

  const [doctors, setDoctors] = useState([]);
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  });

  const parseResponse = async (res) => {
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
    return data;
  };

  // Load doctors - either just the one pre-selected via ?doctor=, or the full list to choose from
  useEffect(() => {
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      setError("");
      try {
        if (preselectedDoctorId) {
          const res = await fetch(`${API_URL}/api/doctors/${preselectedDoctorId}`);
          const data = await parseResponse(res);
          setPreselectedDoctor(data.data);
        } else {
          const res = await fetch(`${API_URL}/api/doctors`);
          const data = await parseResponse(res);
          setDoctors(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [preselectedDoctorId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!localStorage.getItem("userToken")) {
      setError("Please log in to book an appointment.");
      return;
    }

    if (!formData.doctorId) {
      setError("Please select a doctor.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          doctor: formData.doctorId,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
          reason: formData.reason,
          // New-patient fields - the backend creates a Patient record from these
          name: formData.fullName,
          age: Number(formData.age),
          gender: formData.sex,
          phone: formData.phone,
        }),
      });

      await parseResponse(res);

      alert("Appointment booked successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Book an Appointment
        </h1>

        <p className="text-gray-500 mt-3">
          Please provide your details to schedule an appointment
          with our doctors.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Doctor Selection */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Select Doctor
          </h2>

          {loadingDoctors ? (
            <p className="text-gray-500 mb-5">Loading doctors...</p>
          ) : preselectedDoctor ? (
            <div className="mb-5 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3">
              <p className="font-semibold text-gray-800">Dr. {preselectedDoctor.name}</p>
              <p className="text-sm text-gray-600">{preselectedDoctor.specialization}</p>
            </div>
          ) : (
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} - {doc.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Patient Information */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-8">
            Patient Information
          </h2>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter patient's full name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age + Sex */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">

            {/* Age */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="0"
                max="120"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Sex
              </label>

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

          {/* Contact Details */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
            Contact Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contact Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Reason */}
          <div className="mt-5">

            <label className="block text-gray-700 font-medium mb-2">
              Reason for Booking
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe the reason for your appointment"
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

          {/* Appointment Details */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
            Appointment Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {submitting ? "Booking..." : "Book Appointment"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Appointment;

