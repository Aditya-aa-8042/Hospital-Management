import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import healthServices from "../data/healthServices";

const API_URL = "http://localhost:5000";

export default function ServiceDetails() {
  const { serviceSlug } = useParams();
  const service = healthServices.find((item) => item.slug === serviceSlug);
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", preferredDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/service-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: form.age ? Number(form.age) : undefined, service: service.title }),
      });
      const text = await response.text();
      let result = {};
      try { result = text ? JSON.parse(text) : {}; } catch { result = {}; }
      if (!response.ok) throw new Error(result.message || `Request failed (status ${response.status})`);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50"><Navbar /><main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Service not found</h1>
        <Link to="/services" className="mt-5 inline-block text-blue-700 hover:underline">Back to services</Link>
      </main></div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/services" className="text-sm font-semibold text-blue-700 hover:underline">← All services</Link>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={service.image} alt={service.title} className="h-72 w-full object-cover" />
            <div className="p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">MediCare services</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{service.title}</h1>
              <p className="mt-4 leading-relaxed text-gray-600">{service.description}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{service.details}</p>
              <p className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">Submitting this form sends a service request. Hospital staff will contact you to confirm availability, preparation and any fees.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">✓</div>
                <h2 className="mt-5 text-2xl font-bold text-gray-900">Request received</h2>
                <p className="mt-3 text-gray-600">We received your request for {service.title}. Our team will contact you using the details provided.</p>
                <Link to="/services" className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Browse other services</Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Register your interest</h2>
                <p className="mt-2 text-gray-500">Share your details and preferred date. We’ll contact you to confirm.</p>
                {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Full name
                    <input name="name" value={form.name} onChange={handleChange} required autoComplete="name" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-gray-700">Phone number
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required autoComplete="tel" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </label>
                    <label className="block text-sm font-medium text-gray-700">Age (optional)
                      <input name="age" type="number" min="0" max="120" value={form.age} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-gray-700">Aadhaar number
                    <input name="adharNumber" type="text" value={form.adharNumber} onChange={handleChange} required maxLength="12" pattern="\d{12}" placeholder="Enter 12-digit Aadhaar number" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </label>
                  {/* <label className="block text-sm font-medium text-gray-700">Email (optional)
                    <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </label> */}
                  <label className="block text-sm font-medium text-gray-700">Preferred date (optional)
                    <input name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} value={form.preferredDate} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">Notes (optional)
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" maxLength="1000" placeholder="Tell us what you need help with" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </label>
                  <button type="submit" disabled={submitting} className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? "Sending request..." : "Submit registration request"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
