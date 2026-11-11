import { Link } from "react-router-dom";
import Navbar from "../Component/Navbar";
import healthServices from "../data/healthServices";

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-14">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-700">Care and diagnostics</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">Our Medical Services</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Explore checkups, scans and diagnostic services. Choose a service to learn more and send an appointment request.
          </p>
        </header>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {healthServices.map((service) => (
            <article key={service.slug} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={service.image} alt={service.title} className="h-52 w-full object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">{service.title}</h2>
                <p className="mt-3 min-h-16 leading-relaxed text-gray-600">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="mt-5 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900">
                  Learn more <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
