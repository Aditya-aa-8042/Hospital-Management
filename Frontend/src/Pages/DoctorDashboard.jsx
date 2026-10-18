import { Link } from "react-router-dom";
import { CalendarDays, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { useDoctorDashboard } from "../Hooks/useDoctorDashboard";
import DoctorHeader from "../Component/DoctorHeader";
import DoctorProfileCard from "../Component/DoctorProfileCard";

const DoctorDashboard = () => {
  const { doctor, appointments, loading, error } = useDoctorDashboard();

  const formatDate = (iso) => (iso ? iso.slice(0, 10) : "");

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === "Pending").length;
  const acceptedAppointments = appointments.filter((a) => a.status === "Confirmed").length;
  const rejectedAppointments = appointments.filter((a) => a.status === "Cancelled").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
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
      <DoctorHeader doctor={doctor} pendingCount={pendingAppointments} />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <DoctorProfileCard doctor={doctor} linkTo="/doctor/appointments" linkLabel="View Appointments" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-500">Manage your appointments and patients</p>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Total Appointments</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalAppointments}</h3>
              </div>
              <CalendarDays size={36} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Pending Requests</p>
                <h3 className="text-3xl font-bold text-yellow-600 mt-2">{pendingAppointments}</h3>
              </div>
              <Clock size={36} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Accepted</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">{acceptedAppointments}</h3>
              </div>
              <CheckCircle size={36} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Rejected</p>
                <h3 className="text-3xl font-bold text-red-600 mt-2">{rejectedAppointments}</h3>
              </div>
              <XCircle size={36} className="text-red-500" />
            </div>
          </div>

        </div>

        {/* ================= RECENT APPOINTMENTS ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Appointment Requests</h2>
              <p className="text-gray-500 text-sm">Latest patient appointment requests</p>
            </div>

            <Link to="/doctor/appointments" className="text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {appointments.filter((a) => a.status === "Pending").length === 0 && (
              <p className="text-gray-400 text-sm">No pending requests right now.</p>
            )}

            {appointments
              .filter((appointment) => appointment.status === "Pending")
              .slice(0, 3)
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.patient?.name}</h3>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    📅 {formatDate(appointment.appointmentDate)}
                    <br />
                    🕒 {appointment.appointmentTime}
                  </div>

                  <Link to="/doctor/appointments" className="text-blue-600 font-medium">
                    Manage
                  </Link>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;