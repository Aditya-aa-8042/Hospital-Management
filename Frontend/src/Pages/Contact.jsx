import Navbar from "../Component/Navbar";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <Navbar />


      {/* ================= CONTACT HERO ================= */}
      <section className="bg-blue-600 text-white py-16">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Have questions? Reach out to us
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-blue-100 text-lg">
            Our healthcare team is here to help you with appointments,
            hospital services, general enquiries and any assistance
            you may need.
          </p>

        </div>

      </section>


      {/* ================= CONTACT SECTION ================= */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12 items-center">


            {/* ================= LEFT CONTENT ================= */}
            <div>

              <p className="text-blue-600 font-semibold">
                GET IN TOUCH
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                We Are Here To Help You
              </h2>

              <p className="text-gray-600 mt-5 leading-relaxed">
                Our hospital provides trusted and patient-centered
                healthcare services with experienced doctors, modern
                facilities and dedicated healthcare professionals.
                If you have any questions about our services,
                appointments or hospital facilities, feel free to
                contact us.
              </p>

              <p className="text-gray-600 mt-4 leading-relaxed">
                You can reach our team through phone or email. You can
                also use our AI assistance to get quick answers and
                guidance about our hospital services.
              </p>


              {/* ================= CONTACT DETAILS ================= */}
              <div className="mt-8 space-y-5">

                {/* Email */}
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm">

                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    📧
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Email
                    </h3>

                    <a
                      href="mailto:info@medicarehospital.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      info@medicarehospital.com
                    </a>
                  </div>

                </div>


                {/* Phone */}
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm">

                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    📞
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Phone
                    </h3>

                    <a
                      href="tel:+911234567890"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      +91 12345 67890
                    </a>
                  </div>

                </div>


                {/* AI Assistance */}
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm">

                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    🤖
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">
                      AI Assistance
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Get quick help and guidance from our AI assistant.
                    </p>
                  </div>

                  <Link
                    to="/ai-assistant"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Get Help
                  </Link>

                </div>

              </div>

            </div>


            {/* ================= RIGHT IMAGE ================= */}
            <div>

              <img
                src="https://www.aimspune.com/wp-content/uploads/2026/07/contact-page.jpeg"
                className="w-full h-[520px] object-cover rounded-3xl shadow-xl"
              />

            </div>

          </div>

        </div>

      </section>
{/* https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNuTiKEb6NIGLPORy22uTd-QzsCokTeBDJkq5e0c4nHwnwpTUPEuPt8lfH&s=10 */}

     {/* ================= SUPPORT SECTION ================= */}
<section
  className="relative py-20 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80')",
  }}
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-blue-900/70"></div>

  {/* Content */}
  <div className="relative max-w-5xl mx-auto px-6 text-center text-white">

    <div className="text-5xl mb-5">
      💙
    </div>

    <h2 className="text-3xl md:text-4xl font-bold">
      Need Assistance?
    </h2>

    <p className="text-blue-100 max-w-2xl mx-auto mt-4 leading-relaxed">
      Whether you need help booking an appointment, finding a
      department, understanding our services or getting general
      information about the hospital, our team is always ready
      to assist you.
    </p>

    <div className="flex flex-wrap justify-center gap-4 mt-7">

      <Link
        to="/appointment"
        className="bg-white text-blue-600 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Book Appointment
      </Link>

      <Link
        to="/ai-assistant"
        className="border border-white text-white px-7 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
      >
        🤖 Ask AI Assistant
      </Link>

    </div>

  </div>
</section>


      {/* ================= FOOTER CONTACT ================= */}
      <section className="bg-blue-600 text-white py-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">

            <div>
              <h3 className="text-xl font-bold">
                🏥 MediCare
              </h3>

              <p className="text-blue-100 mt-2">
                Quality healthcare, anytime, anywhere.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">
                Contact
              </h3>

              <p className="text-blue-100 mt-2">
                📧 info@medicarehospital.com
              </p>

              <p className="text-blue-100 mt-1">
                📞 +91 12345 67890
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">
                Available
              </h3>

              <p className="text-blue-100 mt-2">
                Emergency Care: 24/7
              </p>

              <p className="text-blue-100 mt-1">
                AI Assistance: Available
              </p>
            </div> 
          </div> 
 
        </div> 
 
      </section> 

    </div>
  );
};

export default Contact;
