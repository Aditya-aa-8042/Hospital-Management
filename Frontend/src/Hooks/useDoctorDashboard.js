import { useState, useEffect, useCallback } from "react";

// Change this to your BACKEND's port (where Express/Node runs), not the frontend's (Vite = 5173).
const API_URL = "http://localhost:5000";

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

// Shared by DoctorDashboard.jsx and DoctorAppointments.jsx so both pages
// show the same live data without duplicating fetch/API logic.
export const useDoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        fetch(`${API_URL}/api/doctors/me`, { headers: authHeader() }),
        fetch(`${API_URL}/api/appointments/doctor`, { headers: authHeader() }),
      ]);

      const profileData = await parseResponse(profileRes);
      const appointmentsData = await parseResponse(appointmentsRes);

      setDoctor(profileData.data);
      setAppointments(appointmentsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const acceptAppointment = async (id) => {
    const res = await fetch(`${API_URL}/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ status: "Confirmed" }),
    });
    const data = await parseResponse(res);
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: data.data.status } : a))
    );
  };

  const rejectAppointment = async (id) => {
    const res = await fetch(`${API_URL}/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ status: "Cancelled" }),
    });
    const data = await parseResponse(res);
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: data.data.status } : a))
    );
  };

  const postponeAppointment = async (id, appointmentDate, appointmentTime) => {
    const res = await fetch(`${API_URL}/api/appointments/${id}/postpone`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ appointmentDate, appointmentTime }),
    });
    const data = await parseResponse(res);
    setAppointments((prev) => prev.map((a) => (a._id === id ? data.data : a)));
    return data.data;
  };

  return {
    doctor,
    appointments,
    loading,
    error,
    refetch: fetchDashboardData,
    acceptAppointment,
    rejectAppointment,
    postponeAppointment,
  };
};