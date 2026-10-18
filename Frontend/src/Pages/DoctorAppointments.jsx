import { useState } from "react";
import { Link } from "react-router-dom";
import { User, CheckCircle, XCircle, Timer } from "lucide-react";
import { useDoctorDashboard } from "../Hooks/useDoctorDashboard";
import DoctorHeader from "../Component/DoctorHeader";
import DoctorProfileCard from "../Component/DoctorProfileCard";
import PostponeModal from "../Component/PostponeModal";

const statusStyles = {
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Postponed: "bg-purple-100 text-purple-700",
  Completed: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const DoctorAppointments = () => {
  const {
    doctor,
    appointments,
    loading,
    error,
    acceptAppointment,
    rejectAppointment,
    postponeAppointment,
  } = useDoctorDashboard();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionError, setActionError] = useState("");

  const formatDate = (iso) => (iso ? iso.slice(0, 10) : "");

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;

  const handleAccept = async (id) => {
    setActionError("");
    try {
      await acceptAppointment(id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleReject = async (id) => {
    setActionError("");
    try {
      await rejectAppointment(id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-600 rounded-lg px-6 py-4 max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorHeader doctor={doctor} pendingCount={pendingCount} />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <DoctorProfileCard doctor={doctor} linkTo={null} />

        {actionError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {actionError}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
            <p className="text-gray-500">Manage patient appointment requests</p>
          </div>

          <Link to="/doctor/dashboard" className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-5">
          {appointments.length === 0 && (
            <p className="text-gray-400 text-sm">No appointments yet.</p>
          )}

          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{appointment.patient?.name}</h3>
                    <p className="text-sm text-gray-500">
                      Age: {appointment.patient?.age} • {appointment.patient?.gender}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Reason: {appointment.reason}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Appointment Time</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    📅 {formatDate(appointment.appointmentDate)}
                  </p>
                  <p className="font-semibold text-blue-600">🕒 {appointment.appointmentTime}</p>
                </div>

                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      statusStyles[appointment.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {appointment.status === "Pending" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAccept(appointment._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(appointment._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>

                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <Timer size={18} />
                      Postpone
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>

      {selectedAppointment && (
        <PostponeModal
          appointment={selectedAppointment}
          onConfirm={postponeAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;