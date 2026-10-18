import { useState } from "react";

const PostponeModal = ({ appointment, onConfirm, onClose }) => {
  const [newDate, setNewDate] = useState(appointment.appointmentDate?.slice(0, 10) || "");
  const [newTime, setNewTime] = useState(appointment.appointmentTime || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!newDate || !newTime) {
      setError("Please choose both a new date and time");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onConfirm(appointment._id, newDate, newTime);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">Postpone Appointment</h2>

        <p className="text-gray-500 mt-2">
          Select a new appointment date and time for{" "}
          <span className="font-semibold">{appointment.patient?.name}</span>
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mt-4">{error}</p>
        )}

        <div className="mt-6">
          <label className="block font-medium text-gray-700 mb-2">New Appointment Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-5">
          <label className="block font-medium text-gray-700 mb-2">New Appointment Time</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostponeModal;