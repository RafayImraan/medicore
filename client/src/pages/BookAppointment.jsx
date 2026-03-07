import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, Phone, Video } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../services/api";

function fuzzyIncludes(str, query) {
  return str.toLowerCase().includes(query.toLowerCase());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateICS(booking) {
  const slotValue = booking.slot || `${booking.date} ${booking.time}`;
  const startDate = new Date(slotValue);
  const dtStart = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
  const dtEnd = new Date(startDate.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d{3}/g, "");
  const doctorName = booking.doctor?.name || booking.doctor || "Doctor";
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Medicore//EN\nBEGIN:VEVENT\nUID:${booking.id}\nDTSTAMP:${dtStart}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Appointment with ${doctorName}\nEND:VEVENT\nEND:VCALENDAR`;
}

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

export default function BookAppointmentPro() {
  const location = useLocation();
  const prefill = location?.state || {};
  const [doctors, setDoctors] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [teleType, setTeleType] = useState("in-person");
  const [patient, setPatient] = useState({ name: "", phone: "", email: "" });
  const [reason, setReason] = useState("");
  const [insurance, setInsurance] = useState({ provider: "", number: "" });
  const [coupon, setCoupon] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [aiSymptoms, setAiSymptoms] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const searchRef = useRef(null);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const patientEmail = parsedUser?.email;

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    let alive = true;
    const loadDoctors = async () => {
      try {
        const data = await apiRequest("/api/public/doctors-directory");
        if (!alive) return;
        const normalized = Array.isArray(data)
          ? data.map((doc) => ({
              ...doc,
              fee: doc.fee ?? doc.fees ?? doc.consultationFee ?? 0,
              available: doc.available ?? true,
              slots: Array.isArray(doc.slots)
                ? doc.slots.map((slot) => ({
                    date: slot.date,
                    times: Array.isArray(slot.times)
                      ? slot.times.map((time) => (typeof time === "string" ? { iso: time, taken: false } : time))
                      : [],
                  }))
                : [],
            }))
          : [];
        setDoctors(normalized);
      } catch (error) {
        console.error("Failed to load doctors directory:", error);
        if (alive) setDoctors([]);
      }
    };
    loadDoctors();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!prefill?.doctor) return;
    setSelectedDoctor(prefill.doctor);
    setStep(2);
    if (prefill.slot) {
      setSelectedSlot(prefill.slot);
      setStep(3);
    }
  }, [prefill]);

  useEffect(() => {
    if (!parsedUser) return;
    setPatient((prev) => ({
      ...prev,
      name: parsedUser.name || prev.name,
      email: parsedUser.email || prev.email,
      phone: parsedUser.phone || prev.phone,
    }));
  }, [parsedUser]);

  const loadBookings = async (email = patientEmail || patient.email) => {
    if (!email) return;
    try {
      const response = await apiRequest(`/api/appointments/history?patientEmail=${encodeURIComponent(email)}`);
      setBookings(response?.items || response || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [patientEmail, patient.email]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim();
    if (!query) return doctors;
    return doctors.filter((doctor) =>
      fuzzyIncludes(`${doctor.name} ${doctor.specialization} ${(doctor.languages || []).join(" ")}`, query)
    );
  }, [doctors, search]);

  const estimatedFee = useMemo(() => {
    if (!selectedDoctor) return 0;
    let fee = selectedDoctor.fee || 0;
    if (insurance.provider) fee = Math.round(fee * 0.4);
    if (coupon === "WELCOME10") fee = Math.round(fee * 0.9);
    return fee;
  }, [coupon, insurance, selectedDoctor]);

  const runAISuggest = () => {
    const query = aiSymptoms.toLowerCase();
    if (!query) {
      setAiSuggestion(null);
      return;
    }
    let specialization = "General Physician";
    if (query.includes("chest") || query.includes("heart")) specialization = "Cardiologist";
    if (query.includes("head") || query.includes("seizure")) specialization = "Neurologist";
    if (query.includes("child") || query.includes("fever")) specialization = "Pediatrician";
    if (query.includes("skin") || query.includes("rash")) specialization = "Dermatologist";
    const match = doctors.find((doctor) =>
      doctor.specialization.toLowerCase().includes(specialization.split(" ")[0].toLowerCase())
    ) || doctors[0];
    setAiSuggestion(match ? { specialization, doctor: match } : null);
  };

  const startBookingWithDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseSlot = (slotIso) => {
    setSelectedSlot(slotIso);
    setStep(3);
  };

  const confirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !patient.name || !patient.email || !reason) {
      toast.error("Please complete required fields");
      return;
    }
    if (!isValidEmail(patient.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (new Date(selectedSlot) <= new Date()) {
      toast.error("Please select a future appointment time");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctor: {
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialization: selectedDoctor.specialization,
            experience: selectedDoctor.experience,
            rating: selectedDoctor.rating,
            fee: selectedDoctor.fee,
            languages: selectedDoctor.languages,
            clinic: selectedDoctor.clinic,
          },
          slot: selectedSlot,
          type: teleType,
          patient,
          reason,
          insurance,
          fee: estimatedFee,
        }),
      });
      await loadBookings();
      toast.success("Appointment booked successfully.");
      setStep(4);
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const downloadICS = (booking) => {
    const ics = generateICS(booking);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `appointment-${booking.id}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: "cancelled" }),
      });
      await loadBookings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel appointment.");
    }
  };

  const teleOptions = [
    { id: "in-person", label: "In person", icon: CalendarDays },
    { id: "video", label: "Video", icon: Video },
    { id: "phone", label: "Phone", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Premium booking</p>
            <h1 className="mt-3 font-['Playfair_Display'] text-5xl font-bold tracking-tight text-white">Book care without friction.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Choose a specialist, secure a time slot, and complete your booking through a clear step-by-step flow.
            </p>
          </div>
          <Panel>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${step === item ? "bg-accent-500 text-charcoal-950" : "border border-white/10 text-slate-300"}`}>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              {step === 1 && "Select your doctor"}
              {step === 2 && "Pick an available slot"}
              {step === 3 && "Confirm patient details"}
              {step === 4 && "Booking completed"}
            </p>
          </Panel>
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <Panel>
              <h2 className="text-lg font-semibold text-white">Find a specialist</h2>
              <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctor or specialty" className="mt-4 w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold text-white">AI symptom guide</h2>
              <textarea value={aiSymptoms} onChange={(e) => setAiSymptoms(e.target.value)} rows={4} placeholder="Example: severe chest discomfort and shortness of breath" className="mt-4 w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
              <div className="mt-4 flex gap-2">
                <button onClick={runAISuggest} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">Suggest</button>
                <button onClick={() => { setAiSymptoms(""); setAiSuggestion(null); }} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">Clear</button>
              </div>
              {aiSuggestion && (
                <div className="mt-4 rounded-xl border border-accent-400/20 bg-accent-500/10 p-4">
                  <p className="text-sm text-slate-300">Likely specialty: <span className="font-medium text-white">{aiSuggestion.specialization}</span></p>
                  <button onClick={() => startBookingWithDoctor(aiSuggestion.doctor)} className="mt-2 text-sm font-medium text-accent-300">
                    Continue with {aiSuggestion.doctor.name}
                  </button>
                </div>
              )}
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold text-white">Recent bookings</h2>
              <div className="mt-4 space-y-3">
                {bookings.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4 text-sm text-slate-400">No bookings found yet.</div>
                ) : (
                  bookings.slice(0, 4).map((booking) => (
                    <div key={booking.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <p className="font-medium text-white">{booking.doctor?.name || booking.doctor || "Doctor"}</p>
                      <p className="mt-1 text-sm text-slate-400">{new Date(booking.slot || booking.date).toLocaleString()}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => downloadICS(booking)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">Add to calendar</button>
                        <button onClick={() => cancelBooking(booking.id)} className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">Cancel</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <h2 className="text-2xl font-semibold text-white">1. Choose your doctor</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className={`rounded-2xl border p-5 ${selectedDoctor?.id === doctor.id ? "border-accent-400/30 bg-accent-500/10" : "border-white/10 bg-charcoal-950/40"}`}>
                    <p className="text-lg font-medium text-white">{doctor.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{doctor.specialization}</p>
                    <p className="mt-3 text-sm text-slate-300">{doctor.experience} years experience</p>
                    <p className="mt-1 text-sm text-slate-300">Consultation fee: ${doctor.fee}</p>
                    <button onClick={() => startBookingWithDoctor(doctor)} className="mt-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">
                      Select doctor
                    </button>
                  </div>
                ))}
              </div>
            </Panel>

            {selectedDoctor && (
              <Panel>
                <h2 className="text-2xl font-semibold text-white">2. Choose your slot</h2>
                <p className="mt-2 text-sm text-slate-400">Selected doctor: {selectedDoctor.name}</p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {selectedDoctor.slots.flatMap((slot) =>
                    slot.times.map((time, index) => {
                      const iso = time.iso || time;
                      return (
                        <button key={`${slot.date}-${index}`} onClick={() => chooseSlot(iso)} className={`rounded-xl border p-4 text-left ${selectedSlot === iso ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-charcoal-950/40"}`}>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(slot.date).toLocaleDateString()}</p>
                          <p className="mt-2 text-sm font-medium text-white">{new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </button>
                      );
                    })
                  )}
                </div>
              </Panel>
            )}

            {selectedDoctor && selectedSlot && (
              <Panel>
                <h2 className="text-2xl font-semibold text-white">3. Confirm details</h2>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input value={patient.name} onChange={(e) => setPatient((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                      <input value={patient.email} onChange={(e) => setPatient((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email address" className="rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                      <input value={patient.phone} onChange={(e) => setPatient((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                      <input value={insurance.provider} onChange={(e) => setInsurance((prev) => ({ ...prev, provider: e.target.value }))} placeholder="Insurance provider" className="rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                    </div>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Reason for visit" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                    <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />

                    <div>
                      <p className="text-sm font-medium text-white">Consultation mode</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {teleOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button key={option.id} onClick={() => setTeleType(option.id)} className={`rounded-xl border px-4 py-3 text-sm ${teleType === option.id ? "border-accent-400/30 bg-accent-500/10 text-white" : "border-white/10 text-slate-200"}`}>
                              <Icon className="mr-2 inline h-4 w-4" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Doctor</p>
                      <p className="mt-2 text-lg font-medium text-white">{selectedDoctor.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{selectedDoctor.specialization}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Appointment</p>
                      <p className="mt-2 text-sm text-white">{new Date(selectedSlot).toLocaleString()}</p>
                      <p className="mt-1 text-sm text-slate-400">Mode: {teleType}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estimated fee</p>
                      <p className="mt-2 text-3xl font-semibold text-white">${estimatedFee}</p>
                    </div>
                    <button onClick={confirmBooking} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
                      {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              </Panel>
            )}

            {step === 4 && (
              <Panel>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-300" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Booking confirmed</h2>
                    <p className="mt-2 text-sm text-slate-300">
                      Your appointment has been secured. You can review it from the recent bookings panel.
                    </p>
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
