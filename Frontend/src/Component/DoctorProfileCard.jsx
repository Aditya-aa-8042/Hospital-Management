import { User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// linkTo + linkLabel let each page decide what the button does
// (Dashboard page -> "View Appointments", Appointments page -> hide it or point back)
const DoctorProfileCard = ({ doctor, linkTo, linkLabel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {doctor?.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <User size={50} className="text-blue-600" />
            )}
          </div>

          <div>
            <p className="text-sm text-blue-600 font-semibold">DOCTOR PROFILE</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">Dr. {doctor?.name}</h2>
            <p className="text-gray-500 mt-1">
              {doctor?.specialization} • {doctor?.experience} Years Experience
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Available: {doctor?.availableTime || "Not set"}
            </p>
          </div>
        </div>

        {linkTo && (
          <Link
            to={linkTo}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            {linkLabel}
            <ChevronRight size={20} />
          </Link>
        )}

      </div>
    </div>
  );
};

export default DoctorProfileCard;