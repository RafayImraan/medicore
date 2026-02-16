import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sun, Moon, Calendar, Clock, Video, Phone, Check, X } from "lucide-react";
import toast from 'react-hot-toast';
import { apiRequest } from "../services/api";
import { useLocation } from "react-router-dom";

// Define fuzzyIncludes helper function for case-insensitive substring matching
function fuzzyIncludes(str, query) {
  return str.toLowerCase().includes(query.toLowerCase());
}

// Simple email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/*
  BookAppointmentPro.jsx
  - Single-file, enterprise-grade appointment booking flow (mock + API-ready placeholders)
  - Features:
    * Doctor search & autosuggest
    * Multi-step booking (Select doctor -> Choose slot -> Patient & Insurance & Book)
    * Interactive slot picker (mock availability) with real-time updates
    * Telemedicine toggle (Video/Phone/In-person)
    * AI symptom helper (mock) that suggests specialty & doctors
    * Insurance input and fee estimation
    * Payment placeholder (mock integration points for Stripe/PayPal)
    * Add to Calendar (.ics) export
    * Confirmation by saving to localStorage and optional placeholder for API call & notifications
    * Reschedule / Cancel existing bookings stored in localStorage
    * Accessibility features, keyboard navigation, dark mode and responsive layout

  Replace placeholder API calls (TODO) with your real endpoints when ready.
*/

// LocalStorage keys
const THEME_KEY = "medicore.theme.dark";


// small ICS generator
function generateICS(booking) {
  const slotValue = booking.slot || `${booking.date} ${booking.time}`;
  const startDate = new Date(slotValue);
  const dtStart = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
  const dtEnd = new Date(startDate.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d{3}/g, "");
  const doctorName = booking.doctor?.name || booking.doctor || "Doctor";
  const clinic = booking.doctor?.clinic || "Clinic";
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Medicore//EN\nBEGIN:VEVENT\nUID:${booking.id}\nDTSTAMP:${dtStart}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Appointment with ${doctorName}\nDESCRIPTION:Type:${booking.type}\\nClinic:${clinic}\\nNotes:${(booking.notes||'').replace(/\n/g,'\\n')}\nEND:VEVENT\nEND:VCALENDAR`;
}

export default function BookAppointmentPro() {
  const location = useLocation();
  const prefill = location?.state || {};
  const [doctors, setDoctors] = useState([]);
  const [step, setStep] = useState(1);
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem(THEME_KEY)) || false; } catch { return false; }
  });
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem(THEME_KEY, JSON.stringify(dark)); }, [dark]);

  // booking form state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [teleType, setTeleType] = useState("in-person"); // in-person, video, phone
  const [patient, setPatient] = useState({ name: "", phone: "", email: "" });
  const [reason, setReason] = useState("");
  const [insurance, setInsurance] = useState({ provider: "", number: "" });
  const [coupon, setCoupon] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [aiSymptoms, setAiSymptoms] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const patientEmail = parsedUser?.email;

  const searchRef = useRef(null);
  useEffect(()=> searchRef.current?.focus(),[]);

  useEffect(() => {
    let alive = true;
    const loadDoctors = async () => {
      try {
        const data = await apiRequest('/api/public/doctors-directory');
        if (!alive) return;
        const normalized = Array.isArray(data) ? data.map(doc => ({
          ...doc,
          fee: doc.fee ?? doc.fees ?? doc.consultationFee ?? 0,
          available: doc.available ?? true,
          slots: Array.isArray(doc.slots) ? doc.slots.map(s => ({
            date: s.date,
            times: Array.isArray(s.times) ? s.times.map(t => (
              typeof t === 'string' ? { iso: t, taken: false } : t
            )) : []
          })) : []
        })) : [];
        setDoctors(normalized);
      } catch (err) {
        console.error('Failed to load doctors directory:', err);
        if (alive) setDoctors([]);
      }
    };
    loadDoctors();
    return () => { alive = false; };
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
      phone: parsedUser.phone || prev.phone
    }));
  }, [parsedUser]);

  const loadBookings = async (email = patientEmail || patient.email) => {
    if (!email) return;
    try {
      const res = await apiRequest(`/api/appointments/history?patientEmail=${encodeURIComponent(email)}`);
      const items = res?.items || res || [];
      setBookings(items);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [patientEmail, patient.email]);

  // simple search autosuggest
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const matches = doctors.filter(d => (d.name + ' ' + d.specialization + ' ' + d.languages.join(' ')).toLowerCase().includes(q)).slice(0,6);
    setSuggestions(matches);
  }, [search, doctors]);

  // AI symptom helper (mock)
  const runAISuggest = () => {
    const q = aiSymptoms.toLowerCase();
    if (!q) { setAiSuggestion(null); return; }
    let spec = 'General Physician';
    if (q.includes('chest') || q.includes('heart')) spec = 'Cardiologist';
    if (q.includes('head') || q.includes('seizure')) spec = 'Neurologist';
    if (q.includes('child') || q.includes('fever')) spec = 'Pediatrician';
    if (q.includes('skin') || q.includes('rash')) spec = 'Dermatologist';
    const match = doctors.find(d=> d.specialization.toLowerCase().includes(spec.split(' ')[0].toLowerCase())) || doctors[0];
    setAiSuggestion({ spec, doctor: match });
  };

  // compute fee after insurance/coupon (mock logic)
  const estimatedFee = useMemo(() => {
    if (!selectedDoctor) return 0;
    let fee = selectedDoctor.fee;
    // mock insurance: if provider set, reduce cost
    if (insurance.provider) fee = Math.round(fee * 0.4);
    // coupon codes
    if (coupon === 'WELCOME10') fee = Math.round(fee * 0.9);
    return fee;
  }, [selectedDoctor, insurance, coupon]);

  // booking actions
  const startBookingWithDoctor = (doc) => { setSelectedDoctor(doc); setStep(2); window.scrollTo({top:0, behavior:'smooth'}); };
  const chooseSlot = (slotIso) => { setSelectedSlot(slotIso); setStep(3); };

  const confirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !patient.name || !patient.email || !reason) { toast.error('Please complete required fields'); return; }
    if (!isValidEmail(patient.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (estimatedFee <= 0) {
      toast.error('Invalid consultation fee');
      return;
    }
    if (new Date(selectedSlot) <= new Date()) {
      toast.error('Please select a future appointment time');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctor: {
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialization: selectedDoctor.specialization,
            experience: selectedDoctor.experience,
            rating: selectedDoctor.rating,
            fee: selectedDoctor.fee,
            languages: selectedDoctor.languages,
            clinic: selectedDoctor.clinic
          },
          slot: selectedSlot,
          type: teleType,
          patient,
          reason,
          insurance,
          fee: estimatedFee
        })
      });

      await loadBookings();
      toast.success('Appointment booked successfully.');
      setStep(5);
      window.scrollTo({top:0, behavior:'smooth'});
    } catch (e) {
      console.error(e); toast.error('Failed to book — please try again');
    } finally { setLoading(false); }
  };

  const downloadICS = (b) => {
    const ics = generateICS(b);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `appointment-${b.id}.ics`; a.click(); URL.revokeObjectURL(url);
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' })
      });
      await loadBookings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel appointment.');
    }
  };

  const rescheduleBooking = async (id, newIso) => {
    try {
      await apiRequest(`/api/appointments/${id}/reschedule`, {
        method: 'PUT',
        body: JSON.stringify({ slot: newIso })
      });
      await loadBookings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reschedule appointment.');
    }
  };

  // small UI pieces
  const StepIndicator = ({ stepIdx }) => (
    <div className="flex items-center gap-3" aria-hidden>
      {[1,2,3].map(s => (
        <div key={s} className={`px-3 py-1 rounded-full ${s===stepIdx ? 'bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold border border-primary-700/50' : 'bg-charcoal-800/50 text-muted-400 border border-primary-800/30'}`}>{s}</div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider">
              BOOK APPOINTMENT
            </h1>
            <p className="text-sm text-muted-400 font-medium tracking-wide">Fast, secure booking — in-clinic or telemedicine</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setDark(d=>!d)} className="px-3 py-2 rounded border border-primary-800/30 bg-charcoal-800/50 text-muted-400 hover:bg-primary-900/30">{dark ? <Sun/> : <Moon/>}</button>
            <div className="text-xs text-muted-400 font-medium tracking-wide">STEP {step} OF 3</div>
          </div>
        </header>

        {/* Steps */}
        <div className="bg-charcoal-800/50 backdrop-blur-sm rounded-xl p-4 shadow-2xl shadow-charcoal-950/20 border border-primary-900/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-400 font-medium tracking-wide">STEP</div>
              <StepIndicator stepIdx={step} />
            </div>
            <div className="text-sm text-muted-400 font-medium">Estimated fee: <strong className="text-luxury-gold">Rs. {estimatedFee}</strong></div>
          </div>

          {/* Step content */}
          <div className="mt-4">
            {step === 1 && (
              <section aria-labelledby="select-doctor">
                <h2 id="select-doctor" className="text-lg font-semibold mb-2 text-white">1. Choose Doctor</h2>

                <div className="flex gap-3 mb-3">
                  <input aria-label="Search doctors" ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, specialty, language..." className="flex-1 p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" />
                  <select value={teleType} onChange={e=>setTeleType(e.target.value)} className="p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white focus:border-primary-600 focus:ring-1 focus:ring-primary-600">
                    <option value="in-person">In-person</option>
                    <option value="video">Video (Telemedicine)</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                {suggestions.length>0 && (
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map(s => (
                      <button key={s.id} onClick={()=> startBookingWithDoctor(s)} className="text-left p-3 rounded border border-primary-800/30 bg-charcoal-800/50 text-white hover:bg-primary-900/30 transition-all duration-300">{s.name} — <span className="text-xs text-muted-400">{s.specialization}</span></button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.filter(d=> fuzzyIncludes(d.name + ' ' + d.specialization, search)).map(doc => (
                    <div key={doc.id} className="p-3 border border-primary-800/30 rounded-lg bg-charcoal-800/50 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{doc.name}</div>
                          <div className="text-xs text-muted-400">{doc.specialization} • {doc.experience} yrs</div>
                          <div className="text-xs text-muted-500">Languages: {doc.languages.join(', ')}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${doc.available? 'text-green-400' : 'text-red-400'}`}>{doc.available ? 'Available' : 'Busy'}</div>
                          <div className="text-xs text-muted-400">Fee: Rs. {doc.fee}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={()=> startBookingWithDoctor(doc)} className="px-3 py-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded text-sm hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50">Select</button>
                        <button onClick={()=> { setSelectedDoctor(doc); setStep(2); }} className="px-3 py-1 border border-primary-800/30 rounded text-sm text-muted-400 hover:bg-primary-900/30">View</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-white">AI Symptom Helper (demo)</h4>
                  <textarea value={aiSymptoms} onChange={e=>setAiSymptoms(e.target.value)} placeholder="Describe symptoms..." className="w-full p-2 border border-primary-800/30 rounded mt-2 bg-charcoal-800/50 text-black placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" rows={3}></textarea>
                  <div className="flex gap-2 mt-2">
                    <button onClick={runAISuggest} className="px-3 py-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded text-sm hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50">Suggest</button>
                    <button onClick={()=>{ setAiSymptoms(''); setAiSuggestion(null); }} className="px-3 py-1 border border-primary-800/30 rounded text-sm text-muted-400 hover:bg-primary-900/30">Clear</button>
                  </div>
                  {aiSuggestion && (
                    <div className="mt-3 p-2 rounded bg-charcoal-800/50 border border-primary-800/30">
                      <div className="text-sm text-white">Suggested Specialty: <strong className="text-luxury-gold">{aiSuggestion.spec}</strong></div>
                      <div className="mt-1 text-sm text-white">Suggested Doctor: <button onClick={()=> startBookingWithDoctor(aiSuggestion.doctor)} className="text-primary-400 hover:text-luxury-gold">{aiSuggestion.doctor.name}</button></div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="choose-slot">
                <h2 id="choose-slot" className="text-lg font-semibold mb-2 text-white">2. Choose Date & Slot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-400 font-medium">Doctor</div>
                    <div className="font-medium mb-2 text-white">{selectedDoctor?.name} — {selectedDoctor?.specialization}</div>

                    <div className="space-y-2">
                          {selectedDoctor?.slots.map(s => (
                            <div key={s.date} className="p-2 border border-primary-800/30 rounded bg-charcoal-800/50">
                              <div className="text-sm font-medium text-white">{new Date(s.date).toLocaleDateString()}</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {s.times.map((t, idx) => (
                                  <button key={`${t.iso}-${idx}`} disabled={t.taken} onClick={()=> chooseSlot(t.iso)} className={`px-3 py-1 text-sm rounded ${t.taken ? 'bg-charcoal-700 text-muted-500 cursor-not-allowed' : 'bg-primary-900/50 border border-primary-800/30 text-white hover:bg-primary-800/50'}`} aria-disabled={t.taken}>{new Date(t.iso).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</button>
                                ))}
                              </div>
                            </div>
                          ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button onClick={()=> setStep(1)} className="px-3 py-1 border border-primary-800/30 rounded text-muted-400 hover:bg-primary-900/30">Back</button>
<button disabled={!selectedSlot} onClick={()=> setStep(3)} className={`px-3 py-1 rounded bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50 ${selectedSlot ? '' : 'opacity-50 cursor-not-allowed'}`}>Continue</button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white">Slot Preview</h4>
                    {selectedSlot ? (
                      <div className="p-3 mt-2 border border-primary-800/30 rounded bg-charcoal-800/50">
                        <div className="text-sm text-white">{new Date(selectedSlot).toLocaleString()}</div>
                        <div className="mt-2 text-xs text-muted-400">Telemedicine: {teleType}</div>
                        <div className="mt-2 text-xs text-muted-400">Fee estimate: Rs. {estimatedFee}</div>
                      </div>
                    ) : <div className="text-xs text-muted-400 mt-2">No slot selected</div>}

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white">Open Slots (quick view)</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        {selectedDoctor?.slots.slice(0,6).flatMap(s=>s.times).filter(t=>!t.taken).slice(0,9).map((t, idx)=> (
                          <div key={`${t.iso}-${idx}`} className="p-2 rounded border border-primary-800/30 bg-charcoal-800/50 text-center text-white">{new Date(t.iso).toLocaleDateString().slice(5)}<div className="mt-1 font-medium">{new Date(t.iso).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="patient-details">
                <h2 id="patient-details" className="text-lg font-semibold mb-2 text-white">3. Patient & Insurance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <div className="text-xs text-muted-400 font-medium">Full name</div>
                    <input value={patient.name} onChange={e=>setPatient(p=>({...p, name:e.target.value}))} className="w-full p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" required />
                  </label>
                  <label className="block">
                    <div className="text-xs text-muted-400 font-medium">Phone</div>
                    <input value={patient.phone} onChange={e=>setPatient(p=>({...p, phone:e.target.value}))} className="w-full p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" />
                  </label>
                  <label className="block">
                    <div className="text-xs text-muted-400 font-medium">Email</div>
                    <input value={patient.email} onChange={e=>setPatient(p=>({...p, email:e.target.value}))} className="w-full p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" required />
                  </label>
                  <label className="block">
                    <div className="text-xs text-muted-400 font-medium">Insurance Provider (optional)</div>
                    <input value={insurance.provider} onChange={e=>setInsurance(i=>({...i, provider:e.target.value}))} className="w-full p-2 border border-primary-800/30 rounded bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" />
                  </label>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-muted-400 font-medium">Reason for Visit (short)</div>
                  <textarea value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 border border-primary-800/30 rounded mt-1 bg-charcoal-800/50 text-white placeholder-muted-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600" rows={3}></textarea>
                </div>

                <div className="mt-3 flex gap-4 justify-end">
                  <button onClick={()=> setStep(2)} className="px-3 py-1 border border-primary-800/30 rounded text-muted-400 hover:bg-primary-900/30">Back</button>
                  <button onClick={()=> setStep(4)} className="px-3 py-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50">Proceed to Confirm</button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="confirm">
                <h2 id="confirm" className="text-lg font-semibold mb-2 text-white">4. Review & Confirm</h2>
                <div className="p-3 border border-primary-800/30 rounded bg-charcoal-800/50 backdrop-blur-sm shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-400 font-medium">Doctor</div>
                      <div className="font-medium text-white">{selectedDoctor?.name} — {selectedDoctor?.specialization}</div>
                      <div className="text-xs mt-1 text-muted-400">Clinic: {selectedDoctor?.clinic}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-400 font-medium">When</div>
                      <div className="font-medium text-white">{selectedSlot ? new Date(selectedSlot).toLocaleString() : '—'}</div>
                      <div className="text-xs mt-1 text-muted-400">Mode: {teleType}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-400 font-medium">Patient</div>
                    <div className="mt-1 text-white">{patient.name} • {patient.phone} • {patient.email}</div>
                    <div className="text-xs text-muted-400 mt-2 font-medium">Insurance</div>
                    <div className="mt-1 text-white">{insurance.provider || 'None'}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-muted-400 font-medium">Estimated Fee</div>
                    <div className="font-semibold text-lg text-luxury-gold">Rs. {estimatedFee}</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={()=> setStep(3)} className="px-3 py-1 border border-primary-800/30 rounded text-muted-400 hover:bg-primary-900/30">Back</button>
                    <button onClick={confirmBooking} disabled={loading} className="px-3 py-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50">{loading ? 'Booking...' : 'Confirm & Book'}</button>
                  </div>
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <h2 className="text-lg font-semibold mb-2 text-white">Done</h2>
                <div className="p-4 border border-primary-800/30 rounded bg-charcoal-800/50 backdrop-blur-sm shadow-lg">
                  <div className="text-sm text-white">Your appointment has been booked.</div>
                </div>
              </section>
            )}

          </div>

        </div>

        {/* Bookings list (reschedule/cancel) */}
        <div className="mt-6 bg-charcoal-800/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl shadow-charcoal-950/20 border border-primary-900/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Your Bookings</h3>
            <div className="text-xs text-muted-400">Pulled from your appointment records</div>
          </div>
          <div className="space-y-3">
            {bookings.length===0 && <div className="text-sm text-muted-400">No bookings yet</div>}
            {bookings.map(b => (
              <div key={b.id} className="p-3 border border-primary-800/30 rounded bg-charcoal-800/50 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <div className="font-medium text-white">{b.doctor || b.doctor?.name || 'Unknown Doctor'} — {b.specialty || b.doctor?.specialization || 'N/A'}</div>
                  <div className="text-xs text-muted-400">{b.slot ? new Date(b.slot).toLocaleString() : `${b.date} ${b.time}`}</div>
                </div>
                <div className="text-sm text-muted-400">Mode: {b.type} • Fee: Rs. {b.fee || 0}</div>
                <div className="flex gap-2 justify-end">
                  <button onClick={()=> downloadICS(b)} className="px-3 py-1 border border-primary-800/30 rounded text-sm text-muted-400 hover:bg-primary-900/30">Add to Calendar</button>
                  <button onClick={()=> { const newIso = prompt('New ISO datetime (demo)'); if(newIso) rescheduleBooking(b.id, newIso); }} className="px-3 py-1 border border-primary-800/30 rounded text-sm text-muted-400 hover:bg-primary-900/30">Reschedule</button>
                  <button onClick={()=> cancelBooking(b.id)} className="px-3 py-1 bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded text-sm hover:from-accent-700 hover:to-accent-600">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin analytics placeholder */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-charcoal-800/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl shadow-charcoal-950/20 border border-primary-900/30">
            <h4 className="font-semibold mb-2 text-white">Booking Analytics (demo)</h4>
            <div className="text-xs text-muted-400">Most booked specialties this week (mock)</div>
            <div className="mt-3 h-28 bg-charcoal-800/50 rounded flex items-center justify-center text-sm text-muted-400">Charts placeholder — integrate Recharts/Chart.js with your analytics API</div>
          </div>
          <div className="bg-charcoal-800/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl shadow-charcoal-950/20 border border-primary-900/30">
            <h4 className="font-semibold mb-2 text-white">Notifications & Confirmations</h4>
            <div className="text-xs text-muted-400">Integrate Twilio / SendGrid to send SMS / Email confirmations</div>
            <div className="mt-3 text-sm text-white">
              <div className="mb-2">On confirm: POST booking -{">"} /api/appointments</div>
              <div className="mb-2">On success: send SMS & email + calendar invite</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
