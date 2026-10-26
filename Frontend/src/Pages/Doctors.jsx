import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "../Component/Navbar";
import DoctorCard from "../Component/DoctorCard";
import { useDiseases } from "../Hooks/useDiseases";

// Change this to your backend's port (where Express/Node runs)
const API_URL = "http://localhost:5000";

const PLACEHOLDER_IMAGE = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// ---------- Filter option definitions ----------
// Ranges: min is inclusive, max is exclusive (Infinity = no upper limit)
const GENDER_OPTIONS = ["Male", "Female", "Other"].map((g) => ({ id: g, label: g }));

const EXPERIENCE_RANGES = [
  { id: "0-5", label: "Less than 5 years", min: 0, max: 5 },
  { id: "5-10", label: "5 - 10 years", min: 5, max: 10 },
  { id: "10-15", label: "10 - 15 years", min: 10, max: 15 },
  { id: "15+", label: "15+ years", min: 15, max: Infinity },
];

const FEES_RANGES = [
  { id: "0-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 - ₹1000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { id: "2000+", label: "₹2000+", min: 2000, max: Infinity },
];

const emptyFilters = { gender: [], diseases: [], experience: [], fees: [] };

// No range selected = no restriction. Otherwise the value must fall in ANY selected range.
const inSelectedRanges = (value, selectedIds, ranges) => {
  if (selectedIds.length === 0) return true;
  return selectedIds.some((id) => {
    const range = ranges.find((r) => r.id === id);
    return range && value >= range.min && value < range.max;
  });
};

// A doctor matches a disease if they list it under `treats`, OR their specialization
// is the usual specialist for it (e.g. Heart Disease -> Cardiologist).
const doctorMatchesDisease = (doc, disease, diseases) => {
  const treats = (doc.treats || "").toLowerCase();
  const specialization = (doc.specialization || "").toLowerCase();

  if (treats.includes(disease.toLowerCase())) return true;

  const keywords = diseases.find((d) => d.name === disease)?.keywords || [];
  return keywords.some((keyword) => specialization.includes(keyword));
};

// Translates a doctor from the backend into the prop shape DoctorCard expects.
const toCardDoctor = (d) => ({
  _id: d._id,
  name: /^dr\.?\s/i.test(d.name) ? d.name : `Dr. ${d.name}`,
  image: d.image || PLACEHOLDER_IMAGE,
  specialisation: d.specialization,
  experience: d.experience,
  fee: d.fees,
  available: d.isAvailable,
  gender: d.gender || "Not specified",
  days: d.availableDays?.length ? d.availableDays : ["Not specified"],
  timings: d.availableTime || "Not specified",
  treats: d.treats || "Not specified",
  qualifications: d.qualifications,
});

const FilterGroup = ({ title, options, selected, onToggle }) => (
  <div className="border-b border-gray-100 pb-5">
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.id}
          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.id)}
            onChange={() => onToggle(opt.id)}
            className="accent-blue-600 w-4 h-4"
          />
          <span>
            {opt.label}
            {opt.hint && <span className="block text-xs text-gray-400">{opt.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const Doctors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diseaseParam = searchParams.get("disease") || "";
  const returnTo = searchParams.get("returnTo") || "";

  const { diseases } = useDiseases();

  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false); // mobile only

  // Fetch every doctor once; filtering happens in the browser so it's instant
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/doctors`);
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
        setAllDoctors(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Arriving from the booking form with ?disease=X pre-selects that disease filter
  useEffect(() => {
    setFilters((prev) => ({ ...prev, diseases: diseaseParam ? [diseaseParam] : [] }));
  }, [diseaseParam]);

  // Disease checkboxes: the shared list (minus "Other"), plus a custom disease from the URL if any
  const diseaseOptions = useMemo(() => {
    const base = diseases
      .filter((d) => d.name !== "Other")
      .map((d) => ({
        id: d.name,
        label: d.name,
        hint: d.specialist,
      }));
    const isKnown = base.some((d) => d.id === diseaseParam);
    return diseaseParam && !isKnown ? [...base, { id: diseaseParam, label: diseaseParam }] : base;
  }, [diseases, diseaseParam]);

  const toggleFilter = (group, id) => {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(id)
        ? prev[group].filter((x) => x !== id)
        : [...prev[group], id],
    }));
  };

  const clearFilters = () => setFilters(emptyFilters);

  const activeFilterCount =
    filters.gender.length + filters.diseases.length + filters.experience.length + filters.fees.length;

  // OR within one filter group, AND across different groups
  const filteredDoctors = useMemo(
    () =>
      allDoctors.filter((doc) => {
        if (filters.gender.length > 0 && !filters.gender.includes(doc.gender)) return false;

        if (filters.diseases.length > 0) {
          const matchesAny = filters.diseases.some((d) => doctorMatchesDisease(doc, d, diseases));
          if (!matchesAny) return false;
        }

        if (!inSelectedRanges(doc.experience, filters.experience, EXPERIENCE_RANGES)) return false;
        if (!inSelectedRanges(doc.fees, filters.fees, FEES_RANGES)) return false;

        return true;
      }),
    [allDoctors, filters, diseases]
  );

  // Your card calls onBookAppointment(doctor) with the whole doctor object
  const handleBookAppointment = (doctor) => {
    navigate(`/appointment?doctor=${doctor._id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Doctor Suggestions</h1>

        {returnTo === "appointment" && diseaseParam && (
          <p className="text-blue-600 font-medium mt-2">
            Showing doctors for your selected condition: {diseaseParam}. Adjust the filters to refine.
          </p>
        )}

        <p className="text-gray-500 mt-2">
          {loading
            ? "Loading..."
            : `${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? "s" : ""} found`}
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mt-6">{error}</p>
        )}

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="lg:hidden mt-6 flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
        >
          <SlidersHorizontal size={16} />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8 mt-8">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 lg:sticky lg:top-24">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterGroup
                title="Disease / Condition"
                options={diseaseOptions}
                selected={filters.diseases}
                onToggle={(id) => toggleFilter("diseases", id)}
              />

              <FilterGroup
                title="Gender"
                options={GENDER_OPTIONS}
                selected={filters.gender}
                onToggle={(id) => toggleFilter("gender", id)}
              />

              <FilterGroup
                title="Experience"
                options={EXPERIENCE_RANGES}
                selected={filters.experience}
                onToggle={(id) => toggleFilter("experience", id)}
              />

              <FilterGroup
                title="Consultation Fee"
                options={FEES_RANGES}
                selected={filters.fees}
                onToggle={(id) => toggleFilter("fees", id)}
              />

            </div>
          </aside>

          {/* ================= RESULTS ================= */}
          <div>
            {!loading && !error && filteredDoctors.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-600">
                  {allDoctors.length === 0
                    ? "No doctors available right now."
                    : "No doctors match your filters."}
                </p>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-blue-600 font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}

                {returnTo === "appointment" && (
                  <button
                    onClick={() => navigate(-1)}
                    className="mt-4 block mx-auto text-blue-600 font-semibold hover:underline"
                  >
                    Go back and skip doctor selection instead
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {filteredDoctors.map(toCardDoctor).map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Doctors;