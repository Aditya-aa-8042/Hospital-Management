import { useState } from "react";

const Appointment = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    sex: "",
    phone: "",
    email: "",
    reason: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Appointment Data:", formData);

    alert("Appointment booked successfully!");

    setFormData({
      fullName: "",
      age: "",
      sex: "",
      phone: "",
      email: "",
      reason: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Book an Appointment
        </h1>

        <p className="text-gray-500 mt-3">
          Please provide your details to schedule an appointment
          with our doctors.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <form onSubmit={handleSubmit}>

          {/* Patient Information */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Patient Information
          </h2>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter patient's full name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age + Sex */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">

            {/* Age */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="0"
                max="120"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Sex
              </label>

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

          {/* Contact Details */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
            Contact Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contact Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Reason */}
          <div className="mt-5">

            <label className="block text-gray-700 font-medium mb-2">
              Reason for Booking
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe the reason for your appointment"
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

          {/* Appointment Details */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
            Appointment Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </button>

        </form>

      </div>

    </div>
  );
};

export default Appointment;
