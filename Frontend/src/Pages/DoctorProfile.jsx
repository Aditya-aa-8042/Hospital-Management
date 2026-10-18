import { useState, useEffect } from "react";
import DoctorHeader from "../Component/DoctorHeader";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

const emptyDoctor = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  fees: "",
  gender: "",
  availableTime: "",
  availableDays: [],
  treats: "",
  isAvailable: true,
  image: "",
};

const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctor, setDoctor] = useState(emptyDoctor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/doctors/me`, { headers: authHeader() });
        const data = await parseResponse(res);
        setDoctor({ ...emptyDoctor, ...data.data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setDoctor((prev) => {
      const has = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: has
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/doctors/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          name: doctor.name,
          phone: doctor.phone,
          specialization: doctor.specialization,
          experience: Number(doctor.experience),
          fees: Number(doctor.fees),
          gender: doctor.gender,
          availableTime: doctor.availableTime,
          availableDays: doctor.availableDays,
          treats: doctor.treats,
          isAvailable: doctor.isAvailable,
          image: doctor.image,
        }),
      });
      const data = await parseResponse(res);
      setDoctor({ ...emptyDoctor, ...data.data });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (editable) =>
    `w-full border rounded-lg px-4 py-3 outline-none transition ${
      editable
        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
        : "bg-gray-100 border-gray-200 text-gray-600"
    }`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DoctorHeader doctor={doctor} pendingCount={0} />
        <p className="text-center py-20 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Fields the DoctorCard actually displays, not collected at registration
  const requiredForCard = [
    { key: "gender", label: "Gender", filled: !!doctor.gender },
    { key: "availableDays", label: "Available Days", filled: doctor.availableDays.length > 0 },
    { key: "availableTime", label: "Available Time", filled: !!doctor.availableTime },
    { key: "treats", label: "What You Treat", filled: !!doctor.treats },
  ];
  const missingFields = requiredForCard.filter((f) => !f.filled);
  const isProfileComplete = missingFields.length === 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorHeader doctor={doctor} pendingCount={0} />

      {/* ================= HEADER BANNER ================= */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
          <p className="text-blue-100 mt-2">View and manage your professional information.</p>
        </div>
      </section>

      {/* ================= COMPLETE PROFILE PROMPT ================= */}
      {!isProfileComplete && !isEditing && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-yellow-800">Complete your profile</p>
              <p className="text-sm text-yellow-700 mt-1">
                Missing: {missingFields.map((f) => f.label).join(", ")}.
                {" "}Patients see this on your doctor card when choosing who to book with.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition whitespace-nowrap"
            >
              Complete Now
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</p>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= LEFT SUMMARY CARD ================= */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center h-fit">
            <div className="flex justify-center">
              <img
                src={doctor.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={doctor.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-5">Dr. {doctor.name}</h2>
            <p className="text-gray-500 mt-1">{doctor.specialization}</p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                doctor.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {doctor.isAvailable ? "Available" : "Unavailable"}
            </span>

            <div className="border-t mt-6 pt-6 text-left space-y-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-700 font-medium break-all">{doctor.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-gray-700 font-medium">{doctor.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Consultation Fee</p>
                <p className="text-gray-700 font-medium">₹{doctor.fees}</p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT DETAILS FORM ================= */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
                <p className="text-gray-500 mt-1">Keep your profile details up to date.</p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleUpdate}>
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={doctor.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>

                {/* Email is set at registration and tied to login - not editable here */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input type="email" value={doctor.email} disabled className={inputClass(false)} />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={doctor.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={doctor.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={doctor.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Consultation Fees (₹)</label>
                  <input
                    type="number"
                    name="fees"
                    min="0"
                    value={doctor.fees}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Available Time</label>
                  <input
                    type="text"
                    name="availableTime"
                    value={doctor.availableTime}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    className={inputClass(isEditing)}
                  />
                </div>

                {/* Available Days - checkboxes, matches the availableDays: [String] field */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-3">
                    {allDays.map((day) => {
                      const checked = doctor.availableDays.includes(day);
                      return (
                        <label
                          key={day}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition ${
                            checked
                              ? "bg-blue-50 border-blue-400 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                          } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!isEditing}
                            onChange={() => toggleDay(day)}
                            className="accent-blue-600"
                          />
                          {day}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    What You Treat / Specialty Focus
                  </label>
                  <input
                    type="text"
                    name="treats"
                    value={doctor.treats}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. Heart Disease, Hypertension"
                    className={inputClass(isEditing)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Profile Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={doctor.image}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://..."
                    className={inputClass(isEditing)}
                  />
                </div>

                {/* Accepting new appointments toggle */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={doctor.isAvailable}
                    disabled={!isEditing}
                    onChange={(e) => setDoctor((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <label htmlFor="isAvailable" className="text-gray-700 font-medium">
                    Currently accepting new appointments
                  </label>
                </div>

              </div>

              {isEditing && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-gray-700 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DoctorProfile;