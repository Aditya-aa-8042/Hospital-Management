import { useState } from "react";
import { Ambulance, ArrowDown, Bone, Flame, HeartPulse, MapPin, PhoneCall, ShieldAlert } from "lucide-react";
import Navbar from "../Component/Navbar";

const API_URL = "http://localhost:5000";

const guides = {
  "heart-attack": {
    title: "Possible heart attack",
    icon: HeartPulse,
    summary: "Possible signs include pressure or squeezing in the chest, pain spreading to the arm, jaw or back, breathlessness, sweating or nausea.",
    do: [
      "Call 112 immediately. Say you suspect a heart attack and give the exact location.",
      "Help the person rest in a comfortable position and stay with them. Do not let them drive themselves.",
      "Watch their breathing and responsiveness. If they become unresponsive and are not breathing normally, start CPR and use an AED if available.",
      "Do not give medicine by default. Follow the emergency call-handler’s instructions; aspirin is not suitable for everyone.",
    ],
    dont: ["Do not delay the emergency call to search for medicine.", "Do not give food, drink, or someone else’s prescription medicine."],
    source: "https://www.nhs.uk/conditions/heart-attack/",
    sourceLabel: "NHS: Heart attack first aid",
  },
  cpr: {
    title: "Unresponsive / CPR",
    icon: HeartPulse,
    summary: "CPR is for someone who is unresponsive and not breathing normally (or is only gasping). A heart attack and cardiac arrest are different emergencies.",
    do: [
      "Check that the area is safe. Call 112 on speakerphone, or tell someone else to call and bring an AED.",
      "For an adult, place the heel of one hand in the centre of the chest and the other hand on top.",
      "Push hard and fast at 100–120 compressions per minute, letting the chest rise fully between pushes.",
      "Keep going until help takes over, the person begins breathing normally, or you cannot continue. Follow the call-handler and AED prompts.",
    ],
    dont: ["Do not perform chest compressions on a responsive person who is breathing normally.", "If you are not trained, focus on continuous chest compressions and follow the call-handler’s instructions."],
    source: "https://www.redcross.org/take-a-class/cpr/performing-cpr/cpr-steps",
    sourceLabel: "American Red Cross: CPR steps",
  },
  burns: {
    title: "Burns and scalds",
    icon: Flame,
    summary: "For a serious, large, electrical, chemical, facial or breathing-related burn, call 112. Keep yourself safe around fire, electricity or chemicals.",
    do: [
      "Move away from the heat source if it is safe. Cool the burn under cool running water for 20 minutes.",
      "Remove nearby jewellery and loose clothing if it is not stuck to the skin.",
      "After cooling, cover loosely with a clean, non-fluffy dressing and seek medical help for significant burns.",
    ],
    dont: ["Do not use ice, butter, toothpaste, oils, or creams.", "Do not pull off clothing stuck to the burn or burst blisters.", "Do not put yourself at risk to reach the injured person."],
    source: "https://www.qvh.nhs.uk/our-services/plastic-surgery-and-burns/burns/burns-first-aid-and-prevention/",
    sourceLabel: "Queen Victoria Hospital NHS: Burns first aid",
  },
  fracture: {
    title: "Suspected fracture",
    icon: Bone,
    summary: "Treat a painful bone or joint injury as a possible fracture. Call 112 for severe injuries, heavy bleeding, exposed bone, shock, or head, neck, back or hip injury.",
    do: [
      "Keep the person and injured area still in the position found. Support it with folded clothing or a cushion if available.",
      "If there is an open wound, cover it with a clean dressing without pressing on a protruding bone.",
      "Keep checking the person’s breathing and responsiveness while waiting for professional help.",
    ],
    dont: ["Do not straighten the limb, push a bone back in, or test whether it moves.", "Do not move someone with a possible head, neck or back injury unless there is immediate danger."],
    source: "https://www.redcross.org/take-a-class/resources/learn-first-aid/fractures",
    sourceLabel: "American Red Cross: Fracture first aid",
  },
  stroke: {
    title: "Possible stroke",
    icon: ShieldAlert,
    summary: "Use FAST: Face drooping, Arm weakness, Speech difficulty — Time to call emergency services. Sudden vision, balance or severe headache symptoms can also be urgent.",
    do: [
      "Call 112 immediately and note the time symptoms started or when the person was last well.",
      "Stay with them and monitor breathing and responsiveness. Follow the emergency call-handler’s instructions.",
    ],
    dont: ["Do not wait to see if symptoms go away.", "Do not give food, drink, or medicine, and do not drive them yourself if an ambulance is available."],
    source: "https://www.stroke.org/en/about-stroke/stroke-symptoms",
    sourceLabel: "American Stroke Association: Stroke warning signs",
  },
};

export default function Emergency() {
  const [selectedGuide, setSelectedGuide] = useState("heart-attack");
  const [transportForm, setTransportForm] = useState({
    patientName: "",
    phone: "",
    pickupAddress: "",
    destinationAddress: "",
    preferredAt: "",
    transportType: "Seated",
    notes: "",
  });
  const [requestState, setRequestState] = useState("idle");
  const [requestError, setRequestError] = useState("");
  const guide = guides[selectedGuide];
  const GuideIcon = guide.icon;

  const handleTransportChange = (event) => {
    setTransportForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleTransportSubmit = async (event) => {
    event.preventDefault();
    setRequestState("submitting");
    setRequestError("");
    try {
      const response = await fetch(`${API_URL}/api/ambulance-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transportForm, preferredAt: new Date(transportForm.preferredAt).toISOString() }),
      });
      const text = await response.text();
      let result = {};
      try { result = text ? JSON.parse(text) : {}; } catch { result = {}; }
      if (!response.ok) throw new Error(result.message || `Request failed (status ${response.status})`);
      setRequestState("submitted");
      setTransportForm({ patientName: "", phone: "", pickupAddress: "", destinationAddress: "", preferredAt: "", transportType: "Seated", notes: "" });
    } catch (error) {
      setRequestError(error.message || "Could not send your transport request. Please try again.");
      setRequestState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-rose-600 to-orange-500 text-white">
          <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-red-950/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1.2fr_.8fr] md:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" /> 24/7 emergency assistance
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">Emergency help, without delay.</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">If someone is in immediate danger, call emergency services now. Do not wait for a website form or message.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="tel:112" className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-lg font-extrabold text-red-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"><PhoneCall size={22} /> Call 112 now</a>
                <a href="tel:108" className="inline-flex items-center gap-3 rounded-xl border border-white/70 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"><Ambulance size={22} /> Call ambulance 108</a>
              </div>
              <p className="mt-4 text-sm text-white/80">112 is India’s integrated emergency number. Ambulance number 108 is available in many states; coverage can vary.</p>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative rounded-[2rem] border border-white/30 bg-white/15 p-7 shadow-2xl backdrop-blur-md">
                <div className="absolute -right-5 -top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl">🚑</div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20"><HeartPulse size={44} /></div>
                <p className="mt-7 text-sm font-bold uppercase tracking-[.2em] text-white/75">Emergency response</p>
                <h2 className="mt-2 text-3xl font-bold">Call. Share location. Follow instructions.</h2>
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-black/10 p-4"><MapPin className="mt-0.5 shrink-0" /><p className="text-sm leading-relaxed">Tell the operator the exact address or nearest landmark, what happened, and whether the person is conscious and breathing.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pt-14">
          <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl">
            <div className="grid lg:grid-cols-[.8fr_1.2fr]">
              <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 p-7 text-white md:p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15"><Ambulance size={36} /></div>
                <p className="mt-7 text-sm font-bold uppercase tracking-[.18em] text-blue-100">Planned patient transport</p>
                <h2 className="mt-3 text-3xl font-extrabold">Request an ambulance</h2>
                <p className="mt-4 leading-relaxed text-blue-50">For scheduled hospital visits or non-emergency patient transport, send a request and hospital staff can contact you to confirm availability.</p>
                <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
                  <p className="font-bold">Need urgent help?</p>
                  <p className="mt-1 text-sm text-blue-50">Do not wait for this form. Call emergency services.</p>
                  <a href="tel:112" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 font-bold text-blue-800 hover:bg-blue-50"><PhoneCall size={18} /> Call 112</a>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-blue-100">A request is not a confirmed booking. Please wait for staff confirmation before relying on transport.</p>
              </div>

              <div className="p-7 md:p-10">
                {requestState === "submitted" ? (
                  <div role="status" className="flex h-full min-h-64 flex-col items-start justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">✓</div>
                    <h3 className="mt-5 text-2xl font-extrabold text-slate-900">Request sent</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-slate-600">Your transport request has been recorded for staff review. It is not confirmed until hospital staff contact you. For immediate danger, call 112 or 108 now.</p>
                    <button onClick={() => setRequestState("idle")} className="mt-6 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">Send another request</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-extrabold text-slate-900">Transport details</h3>
                    <p className="mt-2 text-sm text-slate-500">Fields marked * are required.</p>
                    {requestError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{requestError}</p>}
                    <form onSubmit={handleTransportSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-semibold text-slate-700">Patient name *
                        <input name="patientName" value={transportForm.patientName} onChange={handleTransportChange} required maxLength={120} autoComplete="name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700">Contact phone *
                        <input name="phone" type="tel" value={transportForm.phone} onChange={handleTransportChange} required maxLength={30} autoComplete="tel" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Pickup address *
                        <input name="pickupAddress" value={transportForm.pickupAddress} onChange={handleTransportChange} required maxLength={500} placeholder="House, street, area, city, nearby landmark" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Destination *
                        <input name="destinationAddress" value={transportForm.destinationAddress} onChange={handleTransportChange} required maxLength={500} placeholder="Hospital or destination address" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700">Preferred pickup time *
                        <input name="preferredAt" type="datetime-local" value={transportForm.preferredAt} onChange={handleTransportChange} min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700">Transport assistance *
                        <select name="transportType" value={transportForm.transportType} onChange={handleTransportChange} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                          <option>Seated</option><option>Wheelchair</option><option>Stretcher</option>
                        </select>
                      </label>
                      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Additional transport notes (optional)
                        <textarea name="notes" value={transportForm.notes} onChange={handleTransportChange} maxLength={1000} rows={3} placeholder="Share only details needed to arrange transport" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <button type="submit" disabled={requestState === "submitting"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
                        <Ambulance size={20} /> {requestState === "submitting" ? "Sending request..." : "Request ambulance transport"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="font-bold uppercase tracking-widest text-red-600">Quick action guide</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Know what to do while help is coming</h2>
            <p className="mt-4 leading-relaxed text-slate-600">Choose a situation to see simple first-aid steps. Call 112 first in a life-threatening emergency.</p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500"><ShieldAlert size={30} /></div>
                <h3 className="mt-5 text-2xl font-bold">First, stay safe</h3>
                <p className="mt-3 leading-relaxed text-slate-300">Check that the scene is safe before approaching. Call emergency services, share the location, and follow the operator’s instructions.</p>
                <a href="tel:112" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-bold hover:bg-red-400"><PhoneCall size={18} /> Call 112</a>
              </div>
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex items-center gap-3 text-blue-800"><Ambulance size={25} /><h3 className="text-lg font-bold">Need an ambulance?</h3></div>
                <p className="mt-2 text-sm leading-relaxed text-blue-900">Tap to call 112 or 108. This demo site is not connected to an ambulance dispatch centre and cannot send a vehicle itself.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 md:p-8">
                <label htmlFor="emergency-guide" className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-600">Select an emergency situation</label>
                <div className="relative">
                  <select id="emergency-guide" value={selectedGuide} onChange={(event) => setSelectedGuide(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-4 pr-12 text-lg font-bold text-slate-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100">
                    <option value="heart-attack">Possible heart attack</option>
                    <option value="cpr">Unresponsive / CPR</option>
                    <option value="burns">Burns and scalds</option>
                    <option value="fracture">Suspected fracture</option>
                    <option value="stroke">Possible stroke</option>
                  </select>
                  <ArrowDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                </div>
              </div>

              <div aria-live="polite" className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700"><GuideIcon size={25} /></div>
                  <div><h3 className="text-2xl font-extrabold text-slate-900">{guide.title}</h3><p className="mt-2 leading-relaxed text-slate-600">{guide.summary}</p></div>
                </div>
                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  <div><h4 className="font-bold text-emerald-800">What to do</h4><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">{guide.do.map((step) => <li key={step}>{step}</li>)}</ol></div>
                  <div><h4 className="font-bold text-red-800">What not to do</h4><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-700">{guide.dont.map((step) => <li key={step}>{step}</li>)}</ul></div>
                </div>
                <a href={guide.source} target="_blank" rel="noreferrer" className="mt-7 inline-block text-sm font-semibold text-blue-700 underline underline-offset-4">Read more: {guide.sourceLabel}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl gap-4 px-6 py-6 text-amber-950"><ShieldAlert className="mt-0.5 shrink-0 text-amber-700" /><p className="text-sm leading-relaxed"><strong>Important:</strong> These brief notes are general first aid, not diagnosis or treatment and not a replacement for emergency responders or certified first-aid training. For a real emergency, call 112 and follow the operator’s instructions.</p></div>
        </section>
      </main>
    </div>
  );
}
