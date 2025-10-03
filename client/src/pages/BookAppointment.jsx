import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { Sun, Moon, Calendar, Clock, Video, Phone, Check, X } from "lucide-react";
import toast from 'react-hot-toast';

// Define fuzzyIncludes helper function for case-insensitive substring matching
function fuzzyIncludes(str, query) {
  return str.toLowerCase().includes(query.toLowerCase());
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
const BOOKINGS_KEY = "medicore.bookings.v1";
const THEME_KEY = "medicore.theme.dark";

// Mock doctors list
function generateDoctors(count = 12) {
  return Array.from({ length: count }).map((_, i) => ({
    id: `doc-${i + 1}`,
    name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
    specialization: faker.helpers.arrayElement(["Cardiologist", "Neurologist", "Pediatrician", "Dermatologist", "Radiologist", "Oncologist"]),
    experience: faker.number.int({ min: 3, max: 30 }),
    rating: +(faker.number.float({ min: 3.6, max: 5, precision: 0.1 })).toFixed(1),
    fee: faker.number.int({ min: 10, max: 120 }),
    languages: faker.helpers.arrayElements(["English", "Urdu", "Sindhi", "Punjabi"], faker.number.int({ min: 1, max: 3 })),
    available: Math.random() > 0.3, // random availability
    // generate next 7 days slots
    slots: generateSlotsForDoctor(),
    clinic: faker.location.city(),
  }));
}

function generateSlotsForDoctor() {
  const days = 7;
  const slots = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    const dateISO = day.toISOString().split("T")[0];
    // random times
    const times = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    for (let t = 0; t < faker.number.int({ min: 2, max: 6 }); t++) {
      const hour = faker.number.int({ min: startHour, max: endHour });
      const minute = faker.helpers.arrayElement(["00", "15", "30", "45"]);
      const iso = `${dateISO}T${String(hour).padStart(2, "0")}:${minute}:00`;
      // random chance slot is taken
      const taken = false;
      times.push({ iso, taken });
    }
    slots.push({ date: dateISO, times });
  }
  return slots;
}

// helper to save bookings
function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveBookings(list) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  } catch {}
}

// small ICS generator
function generateICS(booking) {
  const dtStart = new Date(booking.slot).toISOString().replace(/-|:|\.\d{3}/g, "");
  const dtEnd = new Date(new Date(booking.slot).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d{3}/g, "");
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Medicore//EN\nBEGIN:VEVENT\nUID:${booking.id}\nDTSTAMP:${dtStart}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Appointment with ${booking.doctor.name}\nDESCRIPTION:Type:${booking.type}\\nClinic:${booking.doctor.clinic}\\nNotes:${(booking.notes||'').replace(/\n/g,'\\n')}\nEND:VEVENT\nEND:VCALENDAR`;
}

export default function BookAppointmentPro() {
  const [doctors] = useState(() => generateDoctors(14));
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
  const [bookings, setBookings] = useState(() => loadBookings());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [aiSymptoms, setAiSymptoms] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const searchRef = useRef(null);
  useEffect(()=> searchRef.current?.focus(),[]);

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
    if (!selectedDoctor || !selectedSlot || !patient.name) { toast.error('Please complete required fields'); return; }
    setLoading(true);
    try {
      // compose booking
      const booking = {
        id: faker.string.uuid(),
        doctor: selectedDoctor,
        slot: selectedSlot,
        type: teleType,
        patient,
        reason,
        insurance,
        coupon,
        fee: estimatedFee,
        createdAt: new Date().toISOString(),
      };

      // TODO: Call your real scheduling API here
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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
        if (!response.ok) throw new Error('Failed to book appointment');
        const savedBooking = await response.json();

        // update local state with saved booking
        const next = [savedBooking, ...bookings];
        setBookings(next);

        toast.success('Appointment booked successfully.');
        setStep(5);
        window.scrollTo({top:0, behavior:'smooth'});
      } catch (error) {
        console.error(error);
        toast.error('Failed to book appointment. Please try again.');
      }
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

  const cancelBooking = (id) => {
    if (!confirm('Cancel this appointment?')) return;
    const next = bookings.filter(b => b.id !== id); setBookings(next); saveBookings(next);
  };

  const rescheduleBooking = (id, newIso) => {
    const next = bookings.map(b => b.id === id ? { ...b, slot: newIso } : b); setBookings(next); saveBookings(next);
  };

  // small UI pieces
  const StepIndicator = ({ stepIdx }) => (
    <div className="flex items-center gap-3" aria-hidden>
      {[1,2,3].map(s => (
        <div key={s} className={`px-3 py-1 rounded-full ${s===stepIdx ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700'}`}>{s}</div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Book Appointment</h1>
            <p className="text-sm text-gray-500">Fast, secure booking — in-clinic or telemedicine</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setDark(d=>!d)} className="px-3 py-2 rounded border">{dark ? <Sun/> : <Moon/>}</button>
          </div>
        </header>

        {/* Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Step</div>
              <StepIndicator stepIdx={step} />
            </div>
            <div className="text-sm text-gray-500">Estimated fee: <strong>Rs. {estimatedFee}</strong></div>
          </div>

          {/* Step content */}
          <div className="mt-4">
            {step === 1 && (
              <section aria-labelledby="select-doctor">
                <h2 id="select-doctor" className="text-lg font-semibold mb-2">1. Choose Doctor</h2>

                <div className="flex gap-3 mb-3">
                  <input aria-label="Search doctors" ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, specialty, language..." className="flex-1 p-2 border rounded" />
                  <select value={teleType} onChange={e=>setTeleType(e.target.value)} className="p-2 border rounded">
                    <option value="in-person">In-person</option>
                    <option value="video">Video (Telemedicine)</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                {suggestions.length>0 && (
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map(s => (
                      <button key={s.id} onClick={()=> startBookingWithDoctor(s)} className="text-left p-3 rounded border hover:bg-gray-50 dark:hover:bg-gray-900">{s.name} — <span className="text-xs text-gray-500">{s.specialization}</span></button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.filter(d=> fuzzyIncludes(d.name + ' ' + d.specialization, search)).map(doc => (
                    <div key={doc.id} className="p-3 border rounded-lg bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.specialization} • {doc.experience} yrs</div>
                          <div className="text-xs text-gray-400">Languages: {doc.languages.join(', ')}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${doc.available? 'text-green-600' : 'text-red-600'}`}>{doc.available ? 'Available' : 'Busy'}</div>
                          <div className="text-xs text-gray-500">Fee: Rs. {doc.fee}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={()=> startBookingWithDoctor(doc)} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Select</button>
                        <button onClick={()=> { setSelectedDoctor(doc); setStep(2); }} className="px-3 py-1 border rounded text-sm">View</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold">AI Symptom Helper (demo)</h4>
                  <textarea value={aiSymptoms} onChange={e=>setAiSymptoms(e.target.value)} placeholder="Describe symptoms..." className="w-full p-2 border rounded mt-2" rows={3}></textarea>
                  <div className="flex gap-2 mt-2">
                    <button onClick={runAISuggest} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Suggest</button>
                    <button onClick={()=>{ setAiSymptoms(''); setAiSuggestion(null); }} className="px-3 py-1 border rounded text-sm">Clear</button>
                  </div>
                  {aiSuggestion && (
                    <div className="mt-3 p-2 rounded bg-gray-50 dark:bg-gray-900">
                      <div className="text-sm">Suggested Specialty: <strong>{aiSuggestion.spec}</strong></div>
                      <div className="mt-1 text-sm">Suggested Doctor: <button onClick={()=> startBookingWithDoctor(aiSuggestion.doctor)} className="text-blue-600">{aiSuggestion.doctor.name}</button></div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="choose-slot">
                <h2 id="choose-slot" className="text-lg font-semibold mb-2">2. Choose Date & Slot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Doctor</div>
                    <div className="font-medium mb-2">{selectedDoctor?.name} — {selectedDoctor?.specialization}</div>

                    <div className="space-y-2">
                          {selectedDoctor?.slots.map(s => (
                            <div key={s.date} className="p-2 border rounded">
                              <div className="text-sm font-medium">{new Date(s.date).toLocaleDateString()}</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {s.times.map((t, idx) => (
                                  <button key={`${t.iso}-${idx}`} disabled={t.taken} onClick={()=> chooseSlot(t.iso)} className={`px-3 py-1 text-sm rounded ${t.taken ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border'}`} aria-disabled={t.taken}>{new Date(t.iso).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</button>
                                ))}
                              </div>
                            </div>
                          ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button onClick={()=> setStep(1)} className="px-3 py-1 border rounded">Back</button>
<button disabled={!selectedSlot} onClick={()=> setStep(3)} className={`px-3 py-1 rounded bg-emerald-600 text-black ${selectedSlot ? '' : 'opacity-50 cursor-not-allowed'}`}>Continue</button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Slot Preview</h4>
                    {selectedSlot ? (
                      <div className="p-3 mt-2 border rounded">
                        <div className="text-sm">{new Date(selectedSlot).toLocaleString()}</div>
                        <div className="mt-2 text-xs text-gray-500">Telemedicine: {teleType}</div>
                        <div className="mt-2 text-xs text-gray-500">Fee estimate: Rs. {estimatedFee}</div>
                      </div>
                    ) : <div className="text-xs text-gray-500 mt-2">No slot selected</div>}

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">Open Slots (quick view)</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        {selectedDoctor?.slots.slice(0,6).flatMap(s=>s.times).filter(t=>!t.taken).slice(0,9).map((t, idx)=> (
                          <div key={`${t.iso}-${idx}`} className="p-2 rounded border text-center">{new Date(t.iso).toLocaleDateString().slice(5)}<div className="mt-1 font-medium">{new Date(t.iso).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="patient-details">
                <h2 id="patient-details" className="text-lg font-semibold mb-2">3. Patient & Insurance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <div className="text-xs text-gray-500">Full name</div>
                    <input value={patient.name} onChange={e=>setPatient(p=>({...p, name:e.target.value}))} className="w-full p-2 border rounded" required />
                  </label>
                  <label className="block">
                    <div className="text-xs text-gray-500">Phone</div>
                    <input value={patient.phone} onChange={e=>setPatient(p=>({...p, phone:e.target.value}))} className="w-full p-2 border rounded" />
                  </label>
                  <label className="block">
                    <div className="text-xs text-gray-500">Email</div>
                    <input value={patient.email} onChange={e=>setPatient(p=>({...p, email:e.target.value}))} className="w-full p-2 border rounded" />
                  </label>
                  <label className="block">
                    <div className="text-xs text-gray-500">Insurance Provider (optional)</div>
                    <input value={insurance.provider} onChange={e=>setInsurance(i=>({...i, provider:e.target.value}))} className="w-full p-2 border rounded" />
                  </label>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-500">Reason for Visit (short)</div>
                  <textarea value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 border rounded mt-1" rows={3}></textarea>
                </div>

                <div className="mt-3 flex gap-4 justify-end">
                  <button onClick={()=> setStep(2)} className="px-3 py-1 border rounded">Back</button>
                  <button onClick={()=> setStep(4)} className="px-3 py-1 bg-emerald-600 text-black rounded">Proceed to Confirm</button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="confirm">
                <h2 id="confirm" className="text-lg font-semibold mb-2">4. Review & Confirm</h2>
                <div className="p-3 border rounded bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Doctor</div>
                      <div className="font-medium">{selectedDoctor?.name} — {selectedDoctor?.specialization}</div>
                      <div className="text-xs mt-1">Clinic: {selectedDoctor?.clinic}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">When</div>
                      <div className="font-medium">{selectedSlot ? new Date(selectedSlot).toLocaleString() : '—'}</div>
                      <div className="text-xs mt-1">Mode: {teleType}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Patient</div>
                    <div className="mt-1">{patient.name} • {patient.phone} • {patient.email}</div>
                    <div className="text-xs text-gray-500 mt-2">Insurance</div>
                    <div className="mt-1">{insurance.provider || 'None'}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">Estimated Fee</div>
                    <div className="font-semibold text-lg">Rs. {estimatedFee}</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={()=> setStep(3)} className="px-3 py-1 border rounded">Back</button>
                    <button onClick={confirmBooking} disabled={loading} className="px-3 py-1 bg-emerald-600 text-black rounded">{loading ? 'Booking...' : 'Confirm & Book'}</button>
                  </div>
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Done</h2>
                <div className="p-4 border rounded bg-white dark:bg-gray-800">
                  <div className="text-sm">Your appointment has been booked.</div>
                </div>
              </section>
            )}

          </div>

        </div>

        {/* Bookings list (reschedule/cancel) */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Bookings (local demo)</h3>
            <div className="text-xs text-gray-500">Stored locally for demo — integrate API to persist</div>
          </div>
          <div className="space-y-3">
            {bookings.length===0 && <div className="text-sm text-gray-500">No bookings yet</div>}
            {bookings.map(b => (
              <div key={b.id} className="p-3 border rounded grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <div className="font-medium">{b.doctor.name} — {b.doctor.specialization}</div>
                  <div className="text-xs text-gray-500">{new Date(b.slot).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-500">Mode: {b.type} • Fee: Rs. {b.fee}</div>
                <div className="flex gap-2 justify-end">
                  <button onClick={()=> downloadICS(b)} className="px-3 py-1 border rounded text-sm">Add to Calendar</button>
                  <button onClick={()=> { const newIso = prompt('New ISO datetime (demo)'); if(newIso) rescheduleBooking(b.id, newIso); }} className="px-3 py-1 border rounded text-sm">Reschedule</button>
                  <button onClick={()=> cancelBooking(b.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin analytics placeholder */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded">
            <h4 className="font-semibold mb-2">Booking Analytics (demo)</h4>
            <div className="text-xs text-gray-500">Most booked specialties this week (mock)</div>
            <div className="mt-3 h-28 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">Charts placeholder — integrate Recharts/Chart.js with your analytics API</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded">
            <h4 className="font-semibold mb-2">Notifications & Confirmations</h4>
            <div className="text-xs text-gray-500">Integrate Twilio / SendGrid to send SMS / Email confirmations</div>
            <div className="mt-3 text-sm">
              <div className="mb-2">On confirm: POST booking -{">"} /api/appointments</div>
              <div className="mb-2">On success: send SMS & email + calendar invite</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
