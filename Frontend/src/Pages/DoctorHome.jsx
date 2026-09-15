import { useState } from "react";
import {
  User,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  Users,
  Stethoscope,
  Bell,
  ChevronRight,
} from "lucide-react";

const DoctorHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Rahul Kumar",
      age: 25,
      gender: "Male",
      disease: "Brain and Nerve Problem",
      date: "2026-08-30",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Priya Singh",
      age: 30,
      gender: "Female",
      disease: "Heart Problem",
      date: "2026-08-30",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      id: 3,
      patientName: "Amit Sharma",
      age: 42,
      gender: "Male",
      disease: "Back Pain",
      date: "2026-08-30",
      time: "12:00 PM",
      status: "Accepted",
    },
    {
      id: 4,
      patientName: "Neha Kumari",
      age: 28,
      gender: "Female",
      disease: "Skin Problem",
      date: "2026-08-31",
      time: "02:00 PM",
      status: "Pending",
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newTime, setNewTime] = useState("");

  // Accept appointment
  const acceptAppointment = (id) => {
    setAppointments((previousAppointments) =>
      previousAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Accepted" }
          : appointment
      )
    );
  };

  // Reject appointment
  const rejectAppointment = (id) => {
    setAppointments((previousAppointments) =>
      previousAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Rejected" }
          : appointment
      )
    );
  };

  // Open postpone modal
  const openPostponeModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNewTime(appointment.time);
  };

  // Confirm postponed appointment
  const confirmPostpone = () => {
    if (!selectedAppointment || !newTime) return;

    setAppointments((previousAppointments) =>
      previousAppointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              time: newTime,
              status: "Postponed",
            }
          : appointment
      )
    );

    setSelectedAppointment(null);
    setNewTime("");
  };

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const acceptedAppointments = appointments.filter(
    (appointment) => appointment.status === "Accepted"
  ).length;

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "Rejected"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}

      <header className="bg-white shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Stethoscope size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                MediCare Doctor
              </h1>

              <p className="text-sm text-gray-500">
                Doctor Dashboard
              </p>
            </div>

          </div>

          <div className="flex items-center gap-5">

            <button className="relative text-gray-600 hover:text-blue-600">
              <Bell size={23} />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {pendingAppointments}
              </span>
            </button>

            <div className="flex items-center gap-3">

              <div className="text-right hidden sm:block">

                <p className="font-semibold text-gray-800">
                  Dr. Rajesh Kumar
                </p>

                <p className="text-sm text-gray-500">
                  Neurologist
                </p>

              </div>

              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="text-blue-600" />
              </div>

            </div>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= DOCTOR PROFILE ================= */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

                <User
                  size={50}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-blue-600 font-semibold">
                  DOCTOR PROFILE
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  Dr. Rajesh Kumar
                </h2>

                <p className="text-gray-500 mt-1">
                  Neurologist • 12 Years Experience
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Available: Monday - Saturday
                </p>

              </div>

            </div>

            <button
              onClick={() => setActiveTab("appointments")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              View Appointments

              <ChevronRight size={20} />

            </button>

          </div>

        </div>


        {/* ================= DASHBOARD / APPOINTMENTS ================= */}

        {activeTab === "dashboard" ? (

          <>
            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Dashboard Overview
                </h2>

                <p className="text-gray-500">
                  Manage your appointments and patients
                </p>

              </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              <div className="bg-white p-6 rounded-2xl shadow-sm">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      Total Appointments
                    </p>

                    <h3 className="text-3xl font-bold text-gray-800 mt-2">
                      {totalAppointments}
                    </h3>

                  </div>

                  <CalendarDays
                    size={36}
                    className="text-blue-600"
                  />

                </div>

              </div>


              <div className="bg-white p-6 rounded-2xl shadow-sm">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      Pending Requests
                    </p>

                    <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                      {pendingAppointments}
                    </h3>

                  </div>

                  <Clock
                    size={36}
                    className="text-yellow-500"
                  />

                </div>

              </div>


              <div className="bg-white p-6 rounded-2xl shadow-sm">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      Accepted
                    </p>

                    <h3 className="text-3xl font-bold text-green-600 mt-2">
                      {acceptedAppointments}
                    </h3>

                  </div>

                  <CheckCircle
                    size={36}
                    className="text-green-500"
                  />

                </div>

              </div>


              <div className="bg-white p-6 rounded-2xl shadow-sm">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      Rejected
                    </p>

                    <h3 className="text-3xl font-bold text-red-600 mt-2">
                      {rejectedAppointments}
                    </h3>

                  </div>

                  <XCircle
                    size={36}
                    className="text-red-500"
                  />

                </div>

              </div>

            </div>


            {/* ================= RECENT APPOINTMENTS ================= */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Appointment Requests
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Latest patient appointment requests
                  </p>

                </div>

                <button
                  onClick={() => setActiveTab("appointments")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View All
                </button>

              </div>


              <div className="space-y-4">

                {appointments
                  .filter(
                    (appointment) =>
                      appointment.status === "Pending"
                  )
                  .slice(0, 3)
                  .map((appointment) => (

                    <div
                      key={appointment.id}
                      className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                          <Users className="text-blue-600" />

                        </div>

                        <div>

                          <h3 className="font-semibold text-gray-800">
                            {appointment.patientName}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {appointment.disease}
                          </p>

                        </div>

                      </div>


                      <div className="text-sm text-gray-600">

                        📅 {appointment.date}

                        <br />

                        🕒 {appointment.time}

                      </div>


                      <button
                        onClick={() =>
                          setActiveTab("appointments")
                        }
                        className="text-blue-600 font-medium"
                      >
                        Manage
                      </button>

                    </div>

                  ))}

              </div>

            </div>

          </>

        ) : (

          /* ================= APPOINTMENTS PAGE ================= */

          <div>

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  All Appointments
                </h2>

                <p className="text-gray-500">
                  Manage patient appointment requests
                </p>

              </div>

              <button
                onClick={() => setActiveTab("dashboard")}
                className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50"
              >
                Back to Dashboard
              </button>

            </div>


            {/* ================= APPOINTMENT LIST ================= */}

            <div className="space-y-5">

              {appointments.map((appointment) => (

                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    {/* Patient Details */}

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                        <User
                          size={28}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <h3 className="text-lg font-bold text-gray-800">
                          {appointment.patientName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Age: {appointment.age} • {appointment.gender}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Reason: {appointment.disease}
                        </p>

                      </div>

                    </div>


                    {/* Time */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Appointment Time
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        📅 {appointment.date}
                      </p>

                      <p className="font-semibold text-blue-600">
                        🕒 {appointment.time}
                      </p>

                    </div>


                    {/* Status */}

                    <div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          appointment.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : appointment.status === "Postponed"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appointment.status}
                      </span>

                    </div>


                    {/* Action Buttons */}

                    {appointment.status === "Pending" && (

                      <div className="flex flex-wrap gap-3">

                        <button
                          onClick={() =>
                            acceptAppointment(appointment.id)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <CheckCircle size={18} />

                          Accept
                        </button>


                        <button
                          onClick={() =>
                            rejectAppointment(appointment.id)
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <XCircle size={18} />

                          Reject
                        </button>


                        <button
                          onClick={() =>
                            openPostponeModal(appointment)
                          }
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

        )}

      </div>


      {/* ================= POSTPONE MODAL ================= */}

      {selectedAppointment && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold text-gray-800">
              Postpone Appointment
            </h2>

            <p className="text-gray-500 mt-2">

              Select a new appointment time for{" "}

              <span className="font-semibold">
                {selectedAppointment.patientName}
              </span>

            </p>


            <div className="mt-6">

              <label className="block font-medium text-gray-700 mb-2">
                New Appointment Time
              </label>

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <div className="flex justify-end gap-3 mt-7">

              <button
                onClick={() => setSelectedAppointment(null)}
                className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>


              <button
                onClick={confirmPostpone}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default DoctorHome;