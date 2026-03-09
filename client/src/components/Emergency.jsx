import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import { Activity, Ambulance, Clock3, Download, Hospital, MessageCircle, Siren, TriangleAlert } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

function SectionCard({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-5 ${className}`}>{children}</div>;
}

function IncidentForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("Medium");

  const submit = (event) => {
    event.preventDefault();
    if (!title || !description) {
      alert("Please complete the title and description.");
      return;
    }
    onSubmit({ title, description, location, severity });
    setTitle("");
    setDescription("");
    setLocation("");
    setSeverity("Medium");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short incident title" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the event, injuries, and immediate needs" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location or landmark" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
      <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white">Submit Report</button>
        <button type="button" onClick={() => { setTitle(""); setDescription(""); setLocation(""); setSeverity("Medium"); }} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">Reset</button>
      </div>
    </form>
  );
}

export default function EmergencyPro() {
  const [highContrast, setHighContrast] = useState(false);
  const [erQueue, setErQueue] = useState({ waiting: 0, avgWaitMins: 0 });
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [workTrend, setWorkTrend] = useState([]);
  const [metrics, setMetrics] = useState({ erBeds: 0, icuBeds: 0, ventilators: 0, isolation: 0 });
  const [checklist, setChecklist] = useState([]);
  const [reports, setReports] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Emergency assistant online. Describe symptoms or type ambulance." },
  ]);

  useEffect(() => {
    let alive = true;
    const loadEmergency = async () => {
      try {
        const data = await apiRequest("/api/public/emergency");
        if (!alive) return;
        const metricsData = data.metrics || {};
        setEmergencyServices(Array.isArray(data.emergencyServices) ? data.emergencyServices : []);
        setHospitals(Array.isArray(data.hospitals) ? data.hospitals : []);
        setIncidents(Array.isArray(data.incidents) ? data.incidents.map((item) => ({
          id: item._id || item.id || String(Math.random()),
          text: item.text,
          ts: item.occurredAt ? new Date(item.occurredAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          level: item.level || "info",
        })) : []);
        setErQueue({ waiting: metricsData.erQueueWaiting || 0, avgWaitMins: metricsData.erWaitMins || 0 });
        setMetrics({
          erBeds: metricsData.erBeds || 0,
          icuBeds: metricsData.icuBeds || 0,
          ventilators: metricsData.ventilators || 0,
          isolation: metricsData.isolation || 0,
        });
        setWorkTrend(Array.isArray(metricsData.workloadTrend) ? metricsData.workloadTrend : []);
        const englishChecklist = Array.isArray(data.checklists)
          ? data.checklists.find((entry) => entry.language === "en")?.items || []
          : [];
        setChecklist(englishChecklist);
      } catch (error) {
        console.error("Failed to load emergency data:", error);
      }
    };
    loadEmergency();
    return () => {
      alive = false;
    };
  }, []);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const next = chatInput;
    setChatMessages((current) => [...current, { from: "user", text: next }]);
    setChatInput("");
    const lower = next.toLowerCase();
    let reply = "Please call emergency services if there is chest pain, severe bleeding, breathing difficulty, or loss of consciousness.";
    if (lower.includes("ambulance")) reply = "Dispatch flow started. Call +92 21 111 786 786 now for immediate routing.";
    if (lower.includes("burn")) reply = "Cool the area with running water, avoid ice, and proceed to the trauma and burns unit immediately.";
    window.setTimeout(() => {
      setChatMessages((current) => [...current, { from: "bot", text: reply }]);
    }, 500);
  };

  const reportIncident = (payload) => {
    const entry = { id: String(Date.now()), ...payload, ts: new Date().toLocaleString() };
    setReports((current) => [entry, ...current]);
    setIncidents((current) => [
      { id: entry.id, text: payload.description, ts: new Date().toLocaleTimeString(), level: "urgent" },
      ...current,
    ].slice(0, 8));
  };

  const downloadChecklist = () => {
    const blob = new Blob([checklist.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "emergency-checklist.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = useMemo(
    () => [
      { icon: Clock3, label: "ER queue", value: erQueue.waiting, meta: `${erQueue.avgWaitMins} min average wait` },
      { icon: Hospital, label: "ICU beds", value: metrics.icuBeds, meta: `${metrics.erBeds} ER beds live` },
      { icon: Activity, label: "Ventilators", value: metrics.ventilators, meta: `${metrics.isolation} isolation rooms` },
    ],
    [erQueue, metrics]
  );

  return (
    <div className={`${highContrast ? "contrast-more" : ""} min-h-screen bg-gradient-to-br from-charcoal-950 via-red-950/20 to-charcoal-950 text-white`}>
      <header className="border-b border-white/10 bg-gradient-to-br from-red-700 via-red-600 to-red-800">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90">
                <Siren className="h-4 w-4" />
                24/7 Critical Response
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight">Emergency Services</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-red-50/90">
                Fast-response coordination for trauma, ambulance routing, urgent triage, and live hospital readiness.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+92211786786" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-700">Call Ambulance</a>
              <a href="tel:+922134930051" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">Trauma Unit</a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {emergencyServices.length ? (
            emergencyServices.map((service) => (
              <SectionCard key={service.id} className="border border-red-500/15 bg-[linear-gradient(160deg,rgba(127,29,29,0.16),rgba(8,15,28,0.96))]">
                <p className="text-xs uppercase tracking-[0.22em] text-red-200/70">{service.name}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{service.number}</p>
                <p className="mt-2 text-sm text-slate-300">{service.responseTime}</p>
              </SectionCard>
            ))
          ) : (
            <SectionCard className="lg:col-span-3 border border-dashed border-white/10 bg-charcoal-950/40 text-sm text-slate-400">
              Emergency contact services are being updated.
            </SectionCard>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <SectionCard key={card.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{card.meta}</p>
                </div>
                <div className="rounded-2xl bg-red-500/10 p-3 text-red-300">
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </SectionCard>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <SectionCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Nearest hospitals</p>
                <p className="text-sm text-slate-400">Live-ready capacity overview for emergency routing.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {hospitals.length ? (
                hospitals.map((hospital, index) => (
                  <div key={hospital.id || hospital._id || index} className="rounded-xl border border-white/10 bg-charcoal-950/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{hospital.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{hospital.distanceKm} km away | ETA {hospital.etaMin} min</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${hospital.bedsAvailable > 3 ? "bg-emerald-500/15 text-emerald-300" : hospital.bedsAvailable > 0 ? "bg-amber-500/15 text-amber-300" : "bg-rose-500/15 text-rose-300"}`}>
                        {hospital.icuAvailable ? "ICU ready" : "No ICU"} | {hospital.bedsAvailable} beds
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-charcoal-950/40 p-4 text-sm text-slate-400">
                  Hospital routing data is not available right now.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-lg font-semibold text-white">Emergency checklist</p>
            <p className="mt-1 text-sm text-slate-400">Critical actions to complete before transport or arrival.</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {checklist.length ? (
                checklist.map((item, index) => (
                  <li key={index} className="rounded-xl border border-white/10 bg-charcoal-950/40 px-4 py-3">{item}</li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-white/10 bg-charcoal-950/40 px-4 py-3 text-slate-400">
                  Emergency checklist items are not available right now.
                </li>
              )}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={downloadChecklist} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white"><Download className="mr-2 inline h-4 w-4" />Download</button>
              <label className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">
                <input type="checkbox" checked={highContrast} onChange={() => setHighContrast((value) => !value)} />
                High contrast
              </label>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-5 w-5 text-red-300" />
            <div>
              <p className="font-semibold text-white">Live incident ticker</p>
              <p className="text-sm text-slate-400">Latest high-priority activity from the emergency feed.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {incidents.length ? (
              incidents.map((incident) => (
                <div key={incident.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{incident.ts}</p>
                  <p className="mt-2 text-sm text-slate-200">{incident.text}</p>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 rounded-xl border border-dashed border-white/10 bg-charcoal-950/40 p-4 text-sm text-slate-400">
                No active emergency incidents are being displayed right now.
              </div>
            )}
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard>
            <p className="text-lg font-semibold text-white">Demand forecasting</p>
            <p className="mt-1 text-sm text-slate-400">Projected emergency load over the next 12 hours.</p>
            <div className="mt-4 h-64">
              {workTrend.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={workTrend}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                    <XAxis dataKey="period" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-charcoal-950/40 text-sm text-slate-400">
                  Workload forecasting is not available right now.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-accent-300" />
              <div>
                <p className="text-lg font-semibold text-white">Rapid triage assistant</p>
                <p className="text-sm text-slate-400">Get immediate routing guidance while response teams mobilize.</p>
              </div>
            </div>
            <div className="mt-4 h-56 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-charcoal-950/50 p-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.from === "bot" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.from === "bot" ? "bg-white/10 text-slate-200" : "bg-red-600 text-white"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Describe symptoms or type ambulance" className="flex-1 rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
              <button onClick={sendChat} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white">Send</button>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard>
            <p className="text-lg font-semibold text-white">Report an incident</p>
            <p className="mt-1 text-sm text-slate-400">Create a structured escalation entry for the command center.</p>
            <div className="mt-4">
              <IncidentForm onSubmit={reportIncident} />
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-lg font-semibold text-white">Recent reports</p>
            <p className="mt-1 text-sm text-slate-400">Newest incident submissions from staff and field teams.</p>
            <div className="mt-4 space-y-3">
              {reports.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4 text-sm text-slate-400">No reports submitted yet.</div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-white">{report.title}</p>
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">{report.severity}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{report.description}</p>
                    <p className="mt-2 text-xs text-slate-500">{report.location || "Location pending"} | {report.ts}</p>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="tel:+92211786786" className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-red-950/40"><Ambulance className="mr-2 inline h-4 w-4" />Call Ambulance</a>
        <button onClick={() => setChatOpen((value) => !value)} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
          <MessageCircle className="mr-2 inline h-4 w-4" />Assistant
        </button>
      </div>
    </div>
  );
}
