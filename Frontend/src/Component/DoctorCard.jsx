
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Clock,
  UserRound,
  HeartPulse,
} from "lucide-react";

function DoctorCard({ doctor, onBookAppointment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full rounded-xl border border-gray-200
                    bg-white p-4 shadow-sm transition
                    hover:shadow-md">

      <div className="flex flex-col gap-4 sm:flex-row
                      sm:items-center">

        {/* Doctor image */}
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-24 w-24 shrink-0 rounded-lg
                     object-cover"
        />

        {/* Main information */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {doctor.name}
          </h3>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {doctor.specialisation}
          </p>

          <div className="mt-2 flex flex-wrap gap-3 text-sm
                          text-gray-600">
            <span>{doctor.experience} years experience</span>
            <span>Fee: ₹{doctor.fee}</span>
          </div>

          <span className="mt-2 inline-block rounded-full
                           bg-green-100 px-3 py-1 text-xs
                           text-green-700">
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Appointment button */}
        <button
          onClick={() => onBookAppointment(doctor)}
          disabled={!doctor.available}
          className="w-full rounded-lg bg-blue-600 px-5
                     py-3 text-sm font-semibold text-white
                     hover:bg-blue-700 disabled:opacity-50
                     sm:w-auto"
        >
          Book Appointment
        </button>
      </div>

      {/* Expandable details */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex w-full items-center
                     justify-between text-sm font-medium
                     text-gray-700 hover:text-blue-600"
        >
          <span>
            {expanded ? "Hide doctor details" : "View doctor details"}
          </span>
          {expanded ? <ChevronUp size={18} /> :
                      <ChevronDown size={18} />}
        </button>

        {expanded && (
          <div className="mt-4 grid gap-3 text-sm
                          text-gray-600 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <UserRound size={16} />
              Gender: {doctor.gender}
            </p>

            <p className="flex items-center gap-2">
              <CalendarDays size={16} />
              Days: {doctor.days?.join(", ")}
            </p>

            <p className="flex items-center gap-2">
              <Clock size={16} />
              Time: {doctor.timings}
            </p>

            <p className="flex items-center gap-2">
              <HeartPulse size={16} />
              Treats: {doctor.treats}
            </p>

            <p>
              Qualifications: {doctor.qualifications || "Not specified"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorCard;
