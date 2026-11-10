import {
  CalendarDays,
  Clock,
  Stethoscope,
  User,
  HeartPulse,
  Info,
  Phone,
  BellRing,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Component/Navbar";

const API_URL = "http://localhost:5000";



// ==========================================
// STATUS DISPLAY
// Keys are the statuses saved in the database; label/colours are what the patient sees.
// ("Cancelled" = the doctor rejected it. "Cancelled by patient" = the patient cancelled it.)
// ==========================================


export const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    badge: "bg-yellow-100 text-yellow-700",
    note: "Waiting for the doctor to respond.",
  },
  Confirmed: {
    label: "Confirmed",
    badge: "bg-blue-100 text-blue-700",
    note: "The doctor has confirmed your appointment.",
  },
  Cancelled: {
    label: "Rejected",
    badge: "bg-red-100 text-red-700",
    note: "The doctor rejected this appointment. You can book another one.",
  },
  "Cancelled by patient": {
    label: "Cancelled",
    badge: "bg-gray-100 text-gray-700",
    note: "You cancelled this appointment.",
  },
  Postponed: {
    label: "Postponed",
    badge: "bg-purple-100 text-purple-700",
    note: "The doctor rescheduled this appointment. The date and time shown are the new ones.",
  },
  Completed: {
    label: "Completed",
    badge: "bg-green-100 text-green-700",
    note: "This appointment has been completed.",
  },
};

// Reminder choices - must match ALLOWED_REMINDER_MINUTES in the backend controller
export const REMINDER_OPTIONS = [
  { minutes: 30, label: "30 minutes before" },
  { minutes: 60, label: "1 hour before" },
  { minutes: 120, label: "2 hours before" },
  { minutes: 1440, label: "1 day before" },
];

// ==========================================
// HELPERS
// ==========================================

// The appointment's date and time as one moment, read in the patient's own time zone
// (the same way they typed it into the booking form). Returns null if either is missing.
export const getAppointmentDateTime = (appointment) => {
  const date = String(appointment.appointmentDate || "").slice(0, 10);
  const time = /^(\d{1,2}):(\d{2})$/.exec(appointment.appointmentTime || "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !time) return null;

  const when = new Date(`${date}T${time[1].padStart(2, "0")}:${time[2]}:00`);
  return Number.isNaN(when.getTime()) ? null : when;
};

// When the reminder should go off, worked out from the appointment's own date and time
export const getReminderTime = (appointment) => {
  const when = getAppointmentDateTime(appointment);
  if (!when || !appointment.reminderMinutesBefore) return null;
  return new Date(when.getTime() - appointment.reminderMinutesBefore * 60000);
};

export const describeReminder = (minutes) =>
  REMINDER_OPTIONS.find((option) => option.minutes === minutes)?.label || `${minutes} minutes before`;

// Appointment dates are stored as midnight UTC, so read them in UTC to avoid showing the previous day
export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const formatBookedOn = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

// "13:30" -> "1:30 PM"
export const formatTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || "");
  if (!match) return value || "";
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours >= 12 ? "PM" : "AM"}`;
};

// A date and time like "6 Nov, 9:00 am"
export const formatDateTime = (date) =>
  date.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// 45 -> "45 minutes", 90 -> "1 hour 30 minutes", 3000 -> "2 days 2 hours"
export const timeUntil = (milliseconds) => {
  const totalMinutes = Math.max(1, Math.round(milliseconds / 60000));
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  if (totalMinutes < 60) return plural(totalMinutes, "minute");

  if (totalMinutes < 1440) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes ? `${plural(hours, "hour")} ${plural(minutes, "minute")}` : plural(hours, "hour");
  }

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  return hours ? `${plural(days, "day")} ${plural(hours, "hour")}` : plural(days, "day");
};

export const doctorLabel = (doctor) => {
  if (!doctor) return "Doctor no longer available";
  return /^dr\.?\s/i.test(doctor.name) ? doctor.name : `Dr. ${doctor.name}`;
};

// ==========================================
// APPOINTMENT CARD
// ==========================================

function AppointmentItem({ appointment, now, onCancel, onSetReminder }) {

  const status = STATUS_CONFIG[appointment.status] || {
    label: appointment.status,
    badge: "bg-gray-100 text-gray-700",
    note: "",
  };

  const when = getAppointmentDateTime(appointment);
  const isStillAhead = !when || when > now;
  const reminderAt = getReminderTime(appointment);

  // Pending -> the patient can still cancel it.
  // Confirmed (and not over yet) -> the patient can set or change a reminder.
  const canCancel = appointment.status === "Pending";
  const canSetReminder = appointment.status === "Confirmed" && isStillAhead;
  const showReminder = reminderAt && ["Confirmed", "Postponed"].includes(appointment.status);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      {/* Patient + status */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Patient</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.patient?.name || "Patient"}
            </h3>
            <p className="text-sm text-gray-500">
              {appointment.patient?.age ? `${appointment.patient.age} years` : ""}
              {appointment.patient?.age && appointment.patient?.gender ? ", " : ""}
              {appointment.patient?.gender || ""}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
          {status.label}
        </span>
      </div>

      {/* Details */}
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-5 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <Stethoscope size={16} className="text-blue-600 shrink-0" />
          <span>
            <span className="font-semibold">Doctor:</span> {doctorLabel(appointment.doctor)}
            {appointment.doctor?.specialization ? ` (${appointment.doctor.specialization})` : ""}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <HeartPulse size={16} className="text-blue-600 shrink-0" />
          <span>
            <span className="font-semibold">Condition:</span> {appointment.disease}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-blue-600 shrink-0" />
          <span>
            <span className="font-semibold">Date:</span> {formatDate(appointment.appointmentDate)}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600 shrink-0" />
          <span>
            <span className="font-semibold">Time:</span> {formatTime(appointment.appointmentTime)}
          </span>
        </p>

        {appointment.patient?.phone && (
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-blue-600 shrink-0" />
            <span>
              <span className="font-semibold">Contact:</span> {appointment.patient.phone}
            </span>
          </p>
        )}

        {showReminder && (
          <p className="flex items-center gap-2">
            <BellRing size={16} className="text-blue-600 shrink-0" />
            <span>
              <span className="font-semibold">Reminder:</span>{" "}
              {describeReminder(appointment.reminderMinutesBefore)} ({formatDateTime(reminderAt)})
            </span>
          </p>
        )}

        <p className="sm:col-span-2">
          <span className="font-semibold">Reason:</span> {appointment.reason}
        </p>
      </div>

      {/* Status explanation + booking date */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
        {status.note && (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Info size={16} className="shrink-0" />
            {status.note}
          </p>
        )}
        <p className="text-xs text-gray-400">Booked on {formatBookedOn(appointment.createdAt)}</p>
      </div>

      {/* Actions */}
      {(canCancel || canSetReminder) && (
        <div className="border-t border-gray-100 mt-4 pt-4 flex flex-wrap items-center justify-end gap-2">
          {canCancel && (
            <button
              onClick={() => onCancel?.(appointment)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
            >
              <XCircle size={16} />
              Cancel Appointment
            </button>
          )}

          {canSetReminder && (
            <button
              onClick={() => onSetReminder?.(appointment)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
            >
              <BellRing size={16} />
              {appointment.reminderMinutesBefore ? "Change Reminder" : "Set Reminder"}
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export default function AppointmentCard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  }), []);

  const parseResponse = async (response) => {
    const text = await response.text();
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }
    if (!response.ok) throw new Error(body.message || `Request failed (${response.status})`);
    return body;
  };

  const loadAppointments = useCallback(async () => {
    if (!localStorage.getItem("userToken")) {
      setError("Please log in to view your appointments.");
      setAppointments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/appointments/my`, { headers: authHeaders() });
      const body = await parseResponse(response);
      setAppointments(Array.isArray(body.data) ? body.data : []);
    } catch (err) {
      setError(err.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadAppointments();
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, [loadAppointments]);

  const updateAppointment = async (appointment, url, body, successMessage) => {
    setActionId(appointment._id);
    setError("");
    try {
      const response = await fetch(`${API_URL}${url}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const result = await parseResponse(response);
      if (result.data) {
        setAppointments((current) => current.map((item) => item._id === appointment._id ? result.data : item));
      } else {
        await loadAppointments();
      }
      return successMessage;
    } catch (err) {
      setError(err.message || "The appointment could not be updated.");
      return null;
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (appointment) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await updateAppointment(appointment, `/api/appointments/${appointment._id}/cancel`, {}, "Appointment cancelled.");
  };

  const handleReminder = async (appointment) => {
    const options = REMINDER_OPTIONS.map((option, index) => `${index + 1}. ${option.label}`).join("\n");
    const choice = window.prompt(`Choose a reminder:\n${options}\nEnter 1-${REMINDER_OPTIONS.length}, or 0 to remove it:`, "1");
    if (choice === null) return;
    if (choice.trim() === "0") {
      await updateAppointment(appointment, `/api/appointments/${appointment._id}/reminder`, { minutesBefore: null }, "Reminder removed.");
      return;
    }
    const selected = REMINDER_OPTIONS[Number(choice) - 1];
    if (!selected) {
      setError("Choose a valid reminder option.");
      return;
    }
    await updateAppointment(appointment, `/api/appointments/${appointment._id}/reminder`, { minutesBefore: selected.minutes }, "Reminder saved.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-500 mt-2">View the status and details of appointments you booked.</p>
          </div>
          <Link to="/appointment" className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Book an appointment</Link>
        </div>

        {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>}
        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading your appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <CalendarDays className="mx-auto text-blue-600" size={36} />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No appointments yet</h2>
            <p className="mt-2 text-gray-500">Appointments you book will appear here with their latest status.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div key={appointment._id} className={actionId === appointment._id ? "opacity-60 pointer-events-none" : ""}>
                <AppointmentItem appointment={appointment} now={now} onCancel={handleCancel} onSetReminder={handleReminder} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
