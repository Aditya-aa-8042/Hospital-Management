import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";

const Doctors = () => {
  const navigate = useNavigate();

  // =====================================================
  // DOCTOR DATA
  // =====================================================

  const doctors = [
    {
      id: 1,
      name: "Dr. Ananya Sharma",
      gender: "Female",
      specialization: "Cardiologist",
      disease: "Heart Disease",
      experience: 15,
      fee: 800,
      days: ["Monday", "Wednesday", "Friday"],
      time: "10:00 AM - 1:00 PM",
      timePeriod: "Morning",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      gender: "Male",
      specialization: "Dermatologist",
      disease: "Skin Problems",
      experience: 10,
      fee: 600,
      days: ["Tuesday", "Thursday", "Saturday"],
      time: "11:00 AM - 2:00 PM",
      timePeriod: "Morning",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 3,
      name: "Dr. Priya Verma",
      gender: "Female",
      specialization: "Gynecologist",
      disease: "Women's Health",
      experience: 12,
      fee: 700,
      days: ["Monday", "Tuesday", "Thursday"],
      time: "9:00 AM - 12:00 PM",
      timePeriod: "Morning",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 4,
      name: "Dr. Amit Singh",
      gender: "Male",
      specialization: "Neurologist",
      disease: "Brain & Nerve Problems",
      experience: 18,
      fee: 1000,
      days: ["Monday", "Wednesday", "Saturday"],
      time: "2:00 PM - 5:00 PM",
      timePeriod: "Afternoon",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 5,
      name: "Dr. Neha Gupta",
      gender: "Female",
      specialization: "Pediatrician",
      disease: "Child Health",
      experience: 8,
      fee: 500,
      days: ["Monday", "Tuesday", "Friday"],
      time: "10:00 AM - 1:00 PM",
      timePeriod: "Morning",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 6,
      name: "Dr. Vikash Mehta",
      gender: "Male",
      specialization: "Orthopedic",
      disease: "Bone & Joint Problems",
      experience: 14,
      fee: 750,
      days: ["Tuesday", "Thursday", "Saturday"],
      time: "3:00 PM - 6:00 PM",
      timePeriod: "Afternoon",
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 7,
      name: "Dr. Sneha Patel",
      gender: "Female",
      specialization: "General Physician",
      disease: "Fever & General Problems",
      experience: 7,
      fee: 400,
      days: ["Monday", "Wednesday", "Friday"],
      time: "8:00 AM - 11:00 AM",
      timePeriod: "Morning",
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=500&q=80",
    },

    {
      id: 8,
      name: "Dr. Arjun Roy",
      gender: "Male",
      specialization: "ENT Specialist",
      disease: "Ear, Nose & Throat",
      experience: 11,
      fee: 650,
      days: ["Wednesday", "Friday", "Saturday"],
      time: "6:00 PM - 9:00 PM",
      timePeriod: "Evening",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80",
    },

    // ================= NEUROSURGEON =================

    {
      id: 9,
      name: "Dr. Rohan Malhotra",
      gender: "Male",
      specialization: "Neurosurgeon",
      disease: "Brain & Nerve Problems",
      experience: 20,
      fee: 1200,
      days: ["Monday", "Wednesday", "Friday"],
      time: "4:00 PM - 7:00 PM",
      timePeriod: "Evening",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
    },
  ];

  // =====================================================
  // DISEASE → SPECIALIZATION RELATIONSHIP
  // =====================================================

  const diseaseSpecializationMap = {
    "Heart Disease": ["Cardiologist"],

    "Skin Problems": ["Dermatologist"],

    "Women's Health": ["Gynecologist"],

    "Brain & Nerve Problems": [
      "Neurologist",
      "Neurosurgeon",
    ],

    "Child Health": ["Pediatrician"],

    "Bone & Joint Problems": ["Orthopedic"],

    "Fever & General Problems": [
      "General Physician",
    ],

    "Ear, Nose & Throat": [
      "ENT Specialist",
    ],
  };

  // =====================================================
  // SPECIALIZATION → DISEASE RELATIONSHIP
  // =====================================================

  const specializationDiseaseMap = {
    Cardiologist: "Heart Disease",

    Dermatologist: "Skin Problems",

    Gynecologist: "Women's Health",

    Neurologist: "Brain & Nerve Problems",

    Neurosurgeon: "Brain & Nerve Problems",

    Pediatrician: "Child Health",

    Orthopedic: "Bone & Joint Problems",

    "General Physician": "Fever & General Problems",

    "ENT Specialist": "Ear, Nose & Throat",
  };

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [disease, setDisease] = useState("");

  const [specialization, setSpecialization] =
    useState("");

  const [gender, setGender] = useState("");

  const [experience, setExperience] =
    useState("");

  const [maxFee, setMaxFee] =
    useState("");

  const [day, setDay] = useState("");

  const [time, setTime] = useState("");

  const [sortBy, setSortBy] =
    useState("");

  // =====================================================
  // DISEASE CHANGE
  // =====================================================

  const handleDiseaseChange = (e) => {
    const selectedDisease = e.target.value;

    setDisease(selectedDisease);

    if (selectedDisease === "") {
      setSpecialization("");
      return;
    }

    const relatedSpecializations =
      diseaseSpecializationMap[selectedDisease];

    // If only one specialization exists
    if (relatedSpecializations?.length === 1) {
      setSpecialization(
        relatedSpecializations[0]
      );
    }

    // If multiple specializations exist
    else {
      setSpecialization("");
    }
  };

  // =====================================================
  // SPECIALIZATION CHANGE
  // =====================================================

  const handleSpecializationChange = (e) => {
    const selectedSpecialization =
      e.target.value;

    setSpecialization(
      selectedSpecialization
    );

    if (selectedSpecialization === "") {
      setDisease("");
      return;
    }

    const relatedDisease =
      specializationDiseaseMap[
        selectedSpecialization
      ];

    if (relatedDisease) {
      setDisease(relatedDisease);
    }
  };

  // =====================================================
  // FILTER DOCTORS
  // =====================================================

  let filteredDoctors = doctors.filter(
    (doctor) => {

      const diseaseMatch =
        disease === "" ||
        doctor.disease === disease;

      const specializationMatch =
        specialization === "" ||
        doctor.specialization ===
          specialization;

      const genderMatch =
        gender === "" ||
        doctor.gender === gender;

      const experienceMatch =
        experience === "" ||
        doctor.experience >=
          Number(experience);

      const feeMatch =
        maxFee === "" ||
        doctor.fee <= Number(maxFee);

      const dayMatch =
        day === "" ||
        doctor.days.includes(day);

      const timeMatch =
        time === "" ||
        doctor.timePeriod === time;

      return (
        diseaseMatch &&
        specializationMatch &&
        genderMatch &&
        experienceMatch &&
        feeMatch &&
        dayMatch &&
        timeMatch
      );
    }
  );

  // =====================================================
  // SORTING
  // =====================================================

  if (sortBy === "experience-high") {
    filteredDoctors.sort(
      (a, b) =>
        b.experience - a.experience
    );
  }

  if (sortBy === "experience-low") {
    filteredDoctors.sort(
      (a, b) =>
        a.experience - b.experience
    );
  }

  if (sortBy === "fee-low") {
    filteredDoctors.sort(
      (a, b) => a.fee - b.fee
    );
  }

  if (sortBy === "fee-high") {
    filteredDoctors.sort(
      (a, b) => b.fee - a.fee
    );
  }

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setDisease("");
    setSpecialization("");
    setGender("");
    setExperience("");
    setMaxFee("");
    setDay("");
    setTime("");
    setSortBy("");
  };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const bookAppointment = (doctor) => {
    navigate("/appointment", {
      state: {
        doctor: doctor.name,
        specialization:
          doctor.specialization,
        fee: doctor.fee,
        availableDays: doctor.days,
        availableTime: doctor.time,
      },
    });
  };

  // =====================================================
  // GET AVAILABLE SPECIALIZATIONS
  // =====================================================

  const availableSpecializations =
    Object.keys(
      specializationDiseaseMap
    ).filter(
      (specializationName) => {

        // No disease selected
        if (disease === "") {
          return true;
        }

        // Show only related specializations
        return diseaseSpecializationMap[
          disease
        ]?.includes(
          specializationName
        );
      }
    );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= HEADER ================= */}

      <section className="bg-blue-600 text-white py-14">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="text-blue-200 font-semibold">
            FIND YOUR DOCTOR
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Find the Right Doctor for You
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-blue-100">
            Find doctors according to your
            disease, specialization,
            experience, consultation fee,
            gender and availability.
          </p>

        </div>

      </section>


      {/* ================= MAIN ================= */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-4 gap-8">


          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">

              {/* FILTER HEADER */}

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-gray-800">
                  Filters
                </h2>

                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset
                </button>

              </div>


              {/* =================================================
                  DISEASE
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Disease / Problem
                </label>

                <select
                  value={disease}
                  onChange={handleDiseaseChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    All Diseases
                  </option>

                  {Object.keys(
                    diseaseSpecializationMap
                  ).map(
                    (diseaseName) => (
                      <option
                        key={diseaseName}
                        value={diseaseName}
                      >
                        {diseaseName}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* =================================================
                  SPECIALIZATION
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Specialization
                </label>

                <select
                  value={specialization}
                  onChange={
                    handleSpecializationChange
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    All Specializations
                  </option>

                  {availableSpecializations.map(
                    (specializationName) => (
                      <option
                        key={
                          specializationName
                        }
                        value={
                          specializationName
                        }
                      >
                        {
                          specializationName
                        }
                      </option>
                    )
                  )}

                </select>

                {/* Relationship message */}

                {disease && (
                  <p className="text-xs text-blue-600 mt-2">
                    Showing specializations
                    related to{" "}
                    <strong>
                      {disease}
                    </strong>
                  </p>
                )}

              </div>


              {/* =================================================
                  GENDER
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Doctor Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Any Gender
                  </option>

                  <option value="Male">
                    Male Doctor
                  </option>

                  <option value="Female">
                    Female Doctor
                  </option>

                </select>

              </div>


              {/* =================================================
                  EXPERIENCE
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Minimum Experience
                </label>

                <select
                  value={experience}
                  onChange={(e) =>
                    setExperience(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Any Experience
                  </option>

                  <option value="5">
                    5+ Years
                  </option>

                  <option value="10">
                    10+ Years
                  </option>

                  <option value="15">
                    15+ Years
                  </option>

                  <option value="20">
                    20+ Years
                  </option>

                </select>

              </div>


              {/* =================================================
                  FEE
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Maximum Consultation Fee
                </label>

                <select
                  value={maxFee}
                  onChange={(e) =>
                    setMaxFee(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Any Fee
                  </option>

                  <option value="500">
                    Up to ₹500
                  </option>

                  <option value="700">
                    Up to ₹700
                  </option>

                  <option value="800">
                    Up to ₹800
                  </option>

                  <option value="1000">
                    Up to ₹1000
                  </option>

                  <option value="1500">
                    Up to ₹1500
                  </option>

                </select>

              </div>


              {/* =================================================
                  DAY
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Available Day
                </label>

                <select
                  value={day}
                  onChange={(e) =>
                    setDay(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Any Day
                  </option>

                  <option value="Monday">
                    Monday
                  </option>

                  <option value="Tuesday">
                    Tuesday
                  </option>

                  <option value="Wednesday">
                    Wednesday
                  </option>

                  <option value="Thursday">
                    Thursday
                  </option>

                  <option value="Friday">
                    Friday
                  </option>

                  <option value="Saturday">
                    Saturday
                  </option>

                </select>

              </div>


              {/* =================================================
                  TIME
              ================================================= */}

              <div className="mb-5">

                <label className="block font-medium text-gray-700 mb-2">
                  Available Time
                </label>

                <select
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Any Time
                  </option>

                  <option value="Morning">
                    Morning
                  </option>

                  <option value="Afternoon">
                    Afternoon
                  </option>

                  <option value="Evening">
                    Evening
                  </option>

                </select>

              </div>


              {/* =================================================
                  SORT
              ================================================= */}

              <div>

                <label className="block font-medium text-gray-700 mb-2">
                  Preference / Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >

                  <option value="">
                    Recommended
                  </option>

                  <option value="experience-high">
                    Experience: High to Low
                  </option>

                  <option value="experience-low">
                    Experience: Low to High
                  </option>

                  <option value="fee-low">
                    Fee: Low to High
                  </option>

                  <option value="fee-high">
                    Fee: High to Low
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              DOCTOR RESULTS
          ================================================= */}

          <div className="lg:col-span-3">

            {/* RESULT HEADER */}

            <div className="flex flex-wrap justify-between items-center mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Doctor Suggestions
                </h2>

                <p className="text-gray-500 mt-1">
                  {filteredDoctors.length} doctor
                  {filteredDoctors.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

            </div>


            {/* =================================================
                NO RESULTS
            ================================================= */}

            {filteredDoctors.length === 0 && (

              <div className="bg-white rounded-2xl p-12 text-center shadow">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  No doctors found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try changing or removing
                  some filters.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Clear Filters
                </button>

              </div>

            )}


            {/* =================================================
                DOCTOR CARDS
            ================================================= */}

            <div className="grid md:grid-cols-2 gap-6">

              {filteredDoctors.map(
                (doctor) => (

                  <div
                    key={doctor.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                  >

                    {/* DOCTOR IMAGE */}

                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-56 object-cover"
                    />


                    {/* DOCTOR DETAILS */}

                    <div className="p-6">

                      {/* NAME + STATUS */}

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="text-xl font-bold text-gray-800">
                            {doctor.name}
                          </h3>

                          <p className="text-blue-600 font-medium mt-1">
                            {
                              doctor.specialization
                            }
                          </p>

                        </div>

                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Available
                        </span>

                      </div>


                      {/* INFORMATION */}

                      <div className="mt-5 space-y-3">

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            👤 Gender:
                          </span>{" "}
                          {doctor.gender}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            🩺 Experience:
                          </span>{" "}
                          {
                            doctor.experience
                          }{" "}
                          years
                        </p>

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            💰 Consultation Fee:
                          </span>{" "}
                          ₹{doctor.fee}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            📅 Available:
                          </span>{" "}
                          {doctor.days.join(
                            ", "
                          )}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            🕐 Time:
                          </span>{" "}
                          {doctor.time}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-semibold">
                            🩺 Treats:
                          </span>{" "}
                          {doctor.disease}
                        </p>

                      </div>


                      {/* BOOK APPOINTMENT */}

                      <button
                        onClick={() =>
                          bookAppointment(
                            doctor
                          )
                        }
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Book Appointment
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Doctors;