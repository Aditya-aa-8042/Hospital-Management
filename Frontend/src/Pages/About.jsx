import Navbar from "../Component/Navbar";

const About = () => {
  const services = [
    {
      title: "Full Body Check",
      description:
        "Complete health check-up packages to monitor your overall health.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Online Bill Pay Procedure",
      description:
        "Pay your hospital bills online quickly, securely and conveniently.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Hospital Map",
      description:
        "Find departments, rooms, emergency areas and important facilities.",
      image:
        "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Medical Store",
      description:
        "Get prescribed medicines and healthcare products from our medical store.",
      image:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Support & Welfare",
      description:
        "We support patient welfare and provide assistance throughout treatment.",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Many More",
      description:
        "Explore many more healthcare services and facilities available at our hospital.",
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= ABOUT HERO ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT - CONTENT */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-3 leading-tight">
                Healthcare You Can
                <span className="text-blue-600"> Trust</span>
              </h1>

              <p className="text-gray-600 mt-6 leading-relaxed text-lg">
                Our hospital is committed to providing high-quality, affordable
                and patient-centered healthcare services. We combine modern
                medical technology with experienced doctors and compassionate
                healthcare professionals.
              </p>

              <p className="text-gray-600 mt-4 leading-relaxed">
                From routine health check-ups to specialized treatments, our
                goal is to make healthcare accessible and convenient for every
                patient. Our dedicated team works together to ensure a safe,
                comfortable and supportive environment.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                <div>
                  <h3 className="text-3xl font-bold text-blue-600">50+</h3>
                  <p className="text-gray-500 mt-1">Doctors</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-blue-600">20+</h3>
                  <p className="text-gray-500 mt-1">Departments</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
                  <p className="text-gray-500 mt-1">Patients</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
                  <p className="text-gray-500 mt-1">Emergency</p>
                </div>
              </div>
            </div>

            {/* RIGHT - DOCTOR IMAGE */}
            <div className="relative">
              <img
                src="https://thumbs.dreamstime.com/b/indian-female-doctor-22957497.jpg"
                alt="Doctor"
                className="w-full h-[600px] object-cover object-top rounded-3xl shadow-xl"
              />

              {/* Small floating card */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-3">🩺</div>

                  <div>
                    <p className="font-bold text-gray-800">
                      Experienced Doctors
                    </p>

                    <p className="text-sm text-gray-500">
                      Professional Healthcare
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-blue-200 font-semibold">WHY CHOOSE US</p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Your Health Is Our Priority
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-blue-100">
            We provide modern healthcare facilities, experienced doctors,
            advanced medical equipment and compassionate patient care under one
            roof.
          </p>
        </div>
      </section>

      {/* ================= SERVICES SCROLL ================= */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Healthcare Services & Facilities
            </h2>

            <p className="text-gray-500 mt-3">
              Explore the different services available for our patients.
            </p>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-[300px] md:min-w-[340px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 mt-3 leading-relaxed">
                    {service.description}
                  </p>

                  <button className="mt-5 text-blue-600 font-semibold hover:text-blue-800">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            We're Here For You
          </h2>

          <p className="text-white mt-4 leading-relaxed">
            Whether you need a routine health check-up, specialist consultation,
            emergency care or other healthcare services, our team is ready to
            help you.
          </p>

          <a
            href="/appointment"
            className=" inline-block mt-7 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Book an Appointment
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
