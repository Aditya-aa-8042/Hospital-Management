import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDiseases } from "../Hooks/useDiseases";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

const DRAFT_KEY = "appointmentDraft";

const emptyForm = {
  fullName: "",
  age: "",
  sex: "",
  phone: "",
  email: "",
  disease: "",
  otherDisease: "",
  reason: "",
  date: "",
  time: "",
  doctorId: "",
};

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedDoctorId = searchParams.get("doctor") || "";

  const { diseases, loading: loadingDiseases, error: diseasesError } = useDiseases();
  const getDiseaseSpecialist = (name) => diseases.find((d) => d.name === name)?.specialist || null;

  const [formData, setFormData] = useState({ ...emptyForm, doctorId: preselectedDoctorId });
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(!!preselectedDoctorId);
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

  // Restore in-progress form data if the user went to pick a doctor and came back
  useEffect(() => {
    const draftRaw = sessionStorage.getItem(DRAFT_KEY);
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw);
        setFormData((prev) => ({ ...prev, ...draft, doctorId: preselectedDoctorId || prev.doctorId }));
      } catch {
        // ignore a corrupted draft
      }
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [preselectedDoctorId]);

  // If arriving with ?doctor=<id>, load that doctor's info to show read-only
  useEffect(() => {
    if (!preselectedDoctorId) {
      setPreselectedDoctor(null);
      return;
    }
    const loadDoctor = async () => {
      setLoadingDoctor(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/doctors/${preselectedDoctorId}`);
        const data = await parseResponse(res);
        setPreselectedDoctor(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDoctor(false);
      }
    };
    loadDoctor();
  }, [preselectedDoctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const effectiveDisease = formData.disease === "Other" ? formData.otherDisease.trim() : formData.disease;

  const validateBeforeDoctorStep = () => {
    if (!formData.fullName.trim()) return "Please enter the patient's full name";
    if (!formData.age) return "Please enter age";
    if (!formData.sex) return "Please select sex";
    if (!formData.phone.trim()) return "Please enter a contact number";
    if (!formData.disease) return "Please select a disease/condition";
    if (formData.disease === "Other" && !formData.otherDisease.trim())
      return "Please specify the disease/condition";
    if (!formData.reason.trim()) return "Please enter a reason for booking";
    if (!formData.date) return "Please select a preferred date";
    if (!formData.time) return "Please select a preferred time";
    return "";
  };

  // "Choose Doctor" - save the draft, then go filter doctors by the chosen disease
  const handleChooseDoctor = () => {
    const problem = validateBeforeDoctorStep();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    navigate(`/doctors?disease=${encodeURIComponent(effectiveDisease)}&returnTo=appointment`);
  };

  const submitAppointment = async (doctorId) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          ...(doctorId ? { doctor: doctorId } : {}),
          disease: effectiveDisease,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
          reason: formData.reason,
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

  // Normal submit - only reachable when a doctor is already selected (via ?doctor=)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("userToken")) {
      setError("Please log in to book an appointment.");
      return;
    }

    const problem = validateBeforeDoctorStep();
    if (problem) {
      setError(problem);
      return;
    }

    await submitAppointment(formData.doctorId || null);
  };

  // "Skip - auto-assign" - submit without a doctor, backend picks one
  const handleSkip = async () => {
    if (!localStorage.getItem("userToken")) {
      setError("Please log in to book an appointment.");
      return;
    }
    const problem = validateBeforeDoctorStep();
    if (problem) {
      setError(problem);
      return;
    }
    await submitAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-gray-500 mt-3">
          Please provide your details to schedule an appointment with our doctors.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {(error || diseasesError) && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {error || diseasesError}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Patient Information */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
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

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Age</label>
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

            <div>
              <label className="block text-gray-700 font-medium mb-2">Sex</label>
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
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">Contact Details</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
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

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
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

          {/* Disease */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-2">Disease / Condition</label>
            <select
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loadingDiseases ? "Loading..." : "Select a disease/condition"}
              </option>
              {diseases.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>

            {getDiseaseSpecialist(formData.disease) && (
              <p className="text-sm text-blue-600 mt-2">
                Recommended specialist: {getDiseaseSpecialist(formData.disease)}
              </p>
            )}
          </div>

          {formData.disease === "Other" && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Please specify</label>
              <input
                type="text"
                name="otherDisease"
                value={formData.otherDisease}
                onChange={handleChange}
                placeholder="Describe the condition"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Reason */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-2">Reason for Booking</label>
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
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">Appointment Details</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Preferred Time</label>
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

          {/* Doctor Selection */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">Doctor</h2>

          {loadingDoctor ? (
            <p className="text-gray-500 mb-5">Loading doctor...</p>
          ) : preselectedDoctor ? (
            <div className="mb-5 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">Dr. {preselectedDoctor.name}</p>
                <p className="text-sm text-gray-600">{preselectedDoctor.specialization}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreselectedDoctor(null);
                  setFormData((prev) => ({ ...prev, doctorId: "" }));
                  navigate("/appointment", { replace: true });
                }}
                className="text-sm text-blue-600 hover:underline whitespace-nowrap"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="mb-5 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleChooseDoctor}
                className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Choose Doctor
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={submitting}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition"
              >
                {submitting ? "Booking..." : "Skip - Auto Assign Doctor"}
              </button>
            </div>
          )}

          {/* Submit - only shown once a doctor is already attached */}
          {preselectedDoctor && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          )}

        </form>

      </div>

    </div>
  );
};

export default Appointment;