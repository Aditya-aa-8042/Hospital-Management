import { Link } from "react-router-dom";
import Navbar from "../Component/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <Navbar />
      {/* ================= HERO SECTION ================= */}
      <section className="bg-blue-600 text-white">

        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>

            <p className="text-blue-200 font-semibold mb-3"> WELCOME TO OUR HOSPITAL </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight"> Quality Healthcare,
              <br />
              <span className="text-blue-200">
                Anytime, Anywhere.
              </span>
            </h1>

            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              Get access to trusted doctors, book appointments,
              manage your health records and receive quality
              healthcare services in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/appointment"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Book Appointment
              </Link>

              <Link
                to="/doctors"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Find a Doctor
              </Link>

            </div>

          </div>

          {/* Right Image */}
          <div className="flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"
              alt="Hospital"
              className="rounded-2xl shadow-2xl w-full max-w-lg object-cover"
            />

          </div>

        </div>

      </section>


      {/* ================= QUICK SERVICES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold text-gray-800">
            Our Services
          </h2>

          <p className="text-gray-500 mt-2">
            Everything you need for better healthcare
          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Appointment */}
          <Link
            to="/appointment"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📅</div>

            <h3 className="text-xl font-semibold">
              Book Appointment
            </h3>

            <p className="text-gray-500 mt-2">
              Schedule an appointment with our experienced doctors.
            </p>
          </Link>


          {/* Doctors */}
          <Link
            to="/doctors"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">👨‍⚕️</div>

            <h3 className="text-xl font-semibold">
              Find Doctors
            </h3>

            <p className="text-gray-500 mt-2">
              Find the right specialist for your healthcare needs.
            </p>
          </Link>


          {/* Departments */}
          <Link
            to="/departments"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🏥</div>

            <h3 className="text-xl font-semibold">
              Departments
            </h3>

            <p className="text-gray-500 mt-2">
              Explore our medical departments and specialties.
            </p>
          </Link>


          {/* Emergency */}
          <Link
            to="/emergency"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🚑</div>

            <h3 className="text-xl font-semibold">
              Emergency
            </h3>

            <p className="text-gray-500 mt-2">
              Get immediate assistance during medical emergencies.
            </p>
          </Link>

        </div>

      </section>


      {/* ================= ABOUT SECTION ================= */}
      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
            alt="Hospital team"
            className="rounded-2xl shadow-lg"
          />

          <div>

            <p className="text-blue-600 font-semibold">
              ABOUT OUR HOSPITAL
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Healthcare You Can Trust
            </h2>

            <p className="text-gray-600 mt-5 leading-relaxed">
              Our hospital provides comprehensive healthcare services
              with modern medical facilities and experienced healthcare
              professionals. Our goal is to provide safe, accessible
              and patient-centered healthcare.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  50+
                </h3>
                <p className="text-gray-500">
                  Expert Doctors
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  20+
                </h3>
                <p className="text-gray-500">
                  Departments
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  10K+
                </h3>
                <p className="text-gray-500">
                  Happy Patients
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  24/7
                </h3>
                <p className="text-gray-500">
                  Emergency Care
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-blue-600 text-white py-16">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-3xl md:text-4xl font-bold">
            Take Care of Your Health Today
          </h2>

          <p className="mt-4 text-blue-100">
            Book an appointment with our experienced doctors
            and take the first step towards better health.
          </p>


        </div>

      </section>

    </div>
  );
};

export default Home;