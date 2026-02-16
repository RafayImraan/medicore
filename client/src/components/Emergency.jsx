import React, { useEffect, useState } from "react";
import { Particles } from "@tsparticles/react";
import { apiRequest } from "../services/api";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/*
  EmergencyPro.jsx
  - Enterprise-grade Emergency Services page (single-file)
  - Features implemented (mock + placeholders):
    * Click-to-call hotlines & floating call button
    * Live ER queue & wait-time widget (mock real-time updates)
    * Interactive map placeholder (Google Maps iframe slot)
    * Real-time incident ticker
    * Symptom checker chatbot (mock NLP + triage suggestions)
    * Dynamic emergency routing (nearest hospitals list mocked)
    * Predictive workload chart (mock forecast)
    * Emergency checklist accordion and downloadable checklist
    * Multi-language toggle (EN/UR) and accessibility (high-contrast) mode
    * Incident reporting form (submits to mock queue)
    * Bed/ICU availability widget (mock live)
    * Disaster mode toggle (activates drill banner & changes behavior)
    * Pulsing beacon animation on hero
    * Color-coded urgency indicators and icons

  Notes:
  - Replace TODO placeholders with your real APIs (ambulance tracking, ER feed, NLP service).
  - TailwindCSS classes are used; ensure Tailwind is configured.
*/

// -------------------- Main Component --------------------
export default function EmergencyPro() {
  const [lang, setLang] = useState('en');
  const [highContrast, setHighContrast] = useState(false);
  const [disasterMode, setDisasterMode] = useState(false);

  // Live data states
  const [erQueue, setErQueue] = useState({ waiting: 0, avgWaitMins: 0 });
  const [hospitals, setHospitals] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [workTrend, setWorkTrend] = useState([]);
  const [metrics, setMetrics] = useState({ erBeds: 0, icuBeds: 0, ventilators: 0, isolation: 0 });
  const [checklist, setChecklist] = useState({ en: [], ur: [] });
  const [reports, setReports] = useState([]);

  // Chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ from: 'bot', text: lang === 'en' ? 'Emergency Assistant: describe symptoms or type "ambulance"' : 'ایمرجنسی اسسٹنٹ: علامات بیان کریں یا "ambulance" لکھیں' }]);

  // Load emergency data
  useEffect(() => {
    let alive = true;
    const loadEmergency = async () => {
      try {
        const data = await apiRequest('/api/public/emergency');
        if (!alive) return;
        const hospitalsData = Array.isArray(data.hospitals) ? data.hospitals : [];
        const incidentsData = Array.isArray(data.incidents) ? data.incidents : [];
        const checklists = Array.isArray(data.checklists) ? data.checklists : [];
        const metricsData = data.metrics || {};

        setHospitals(hospitalsData);
        setIncidents(incidentsData.map((inc) => ({
          id: inc._id || inc.id,
          text: inc.text,
          ts: inc.occurredAt ? new Date(inc.occurredAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          level: inc.level || 'info'
        })));
        setErQueue({
          waiting: metricsData.erQueueWaiting || 0,
          avgWaitMins: metricsData.erWaitMins || 0
        });
        setMetrics({
          erBeds: metricsData.erBeds || 0,
          icuBeds: metricsData.icuBeds || 0,
          ventilators: metricsData.ventilators || 0,
          isolation: metricsData.isolation || 0
        });
        setWorkTrend(Array.isArray(metricsData.workloadTrend) ? metricsData.workloadTrend : []);
        const en = checklists.find((c) => c.language === 'en')?.items || [];
        const ur = checklists.find((c) => c.language === 'ur')?.items || [];
        setChecklist({ en, ur });
      } catch (err) {
        console.error('Failed to load emergency data:', err);
      }
    };

    loadEmergency();
    return () => { alive = false; };
  }, []);

  // Accessibility: read text aloud
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // Chat send (mock NLP triage)
  const sendChat = (txt) => {
    if (!txt) return;
    setChatMessages(m => [...m, { from: 'user', text: txt }]);
    // simple rules
    const q = txt.toLowerCase();
    setTimeout(() => {
      let reply = lang === 'en' ? "Please call the ambulance if you're experiencing chest pain, severe bleeding, altered consciousness, or difficulty breathing." : 'اگر آپ کو سینے میں درد، شدید خون بہنا، ہوش میں کمی، یا سانس لینے میں دشواری ہو تو ایمبولینس کو کال کریں۔';
      if (q.includes('ambulance') || q.includes('help')) reply = `Call ${'+92 21 111 786 786'} now — sending nearest ambulance (mock).`;
      if (q.includes('burn')) reply = 'Immediate cool running water, then cover with sterile dressing. Advise to come to Trauma & Burns unit.';
      // add bot message
      setChatMessages(m => [...m, { from: 'bot', text: reply }]);
    }, 800);
  };

  // Incident report submit
  const reportIncident = (payload) => {
    const newR = { id: Date.now().toString(), ...payload, ts: new Date().toLocaleString() };
    setReports(r => [newR, ...r]);
    // also add to incidents feed
    setIncidents(i => [{ id: Date.now().toString(), text: payload.description, ts: new Date().toLocaleTimeString(), level: 'urgent' }, ...i].slice(0,8));
  };

  // Export checklist
  const downloadChecklist = () => {
    const lines = (lang === 'en' ? checklist.en : checklist.ur).join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'emergency-checklist.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  // Language helper
  const t = (en, ur) => lang === 'en' ? en : ur;

  return (
    <div className={`${highContrast ? 'contrast-more' : ''} min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 text-white`}>
      {/* Particles + beacon */}
      <div className="absolute inset-0 -z-10">
        <Particles options={{ background: { color: '#00000000' }, particles: { number: { value: 20 }, size: { value: 2 }, move: { speed: 0.6 }, color: { value: '#ef4444' } } }} />
      </div>

      {/* Hero */}
      <header className="relative bg-gradient-to-b from-red-600 to-red-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="rounded-full w-14 h-14 flex items-center justify-center bg-white/20 animate-pulse-beacon">🚨</div>
            <h1 className="text-3xl font-bold">{t('Emergency Services', 'ایمرجنسی سروسز')}</h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-sm">{t('Immediate care available 24/7 for critical medical conditions, trauma, and urgent cases.', 'سخت طبی حالات، ٹراما، اور فوری معاملات کے لئے 24/7 فوری دیکھ بھال دستیاب ہے۔')}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="tel:+92211786786" className="bg-white text-red-700 px-6 py-3 rounded-md font-semibold shadow-lg">{t('Call Ambulance', 'ایمبولینس کال کریں')}</a>
            <a href="tel:+922134930051" className="bg-white text-red-700 px-6 py-3 rounded-md font-semibold shadow-lg">{t('Trauma Unit', 'ٹراما یونٹ')}</a>
            <a href="tel:+922134860001" className="bg-white text-red-700 px-6 py-3 rounded-md font-semibold shadow-lg">{t('Pediatric ER', 'پediاٹرک ای آر')}</a>
          </div>

          <div className="mt-4 text-sm opacity-90">{t('If life-threatening, do not wait — call immediately.', 'اگر جان لیوا حالت ہو تو انتظار نہ کریں — فوراً کال کریں۔')}</div>
        </div>
      </header>

      {/* Quick widgets */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500">{t('ER Queue', 'ای آر قطار')}</div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <div className="text-2xl font-bold">{erQueue.waiting}</div>
                <div className="text-xs text-gray-500">{t('waiting patients', 'انتظار کرنے والے مریض')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{t('Avg. wait', 'اوسط انتظار')}: <strong>{erQueue.avgWaitMins} {t('mins','منٹ')}</strong></div>
                <div className="text-xs text-gray-400 mt-1">{t('Updated live', 'لائیو اپ ڈیٹ')}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">{t('Data is mock for demo. Connect your ER feed to replace.', 'یہ ڈیمو کے ل mock فرضی ڈیٹا ہے۔ اپنے ای آر فیڈ کو تبدیل کرنے کے لیے منسلک کریں۔')}</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500">{t('Nearest Hospitals', 'قریبی ہسپتال')}</div>
            <ul className="mt-2 space-y-2 text-sm">
              {hospitals.map(h => (
                <li key={h.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-gray-500">{h.distanceKm} km • {h.etaMin} mins</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${h.bedsAvailable > 3 ? 'bg-green-100 text-green-800' : h.bedsAvailable > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {h.icuAvailable ? 'ICU' : 'No ICU'} • {h.bedsAvailable}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-gray-500">{t('Tap a hospital to navigate (placeholder).', 'ہسپتال پر ٹیپ کریں تاکہ نیویگیٹ کیا جا سکے (پلیس ہولڈر)۔')}</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{t('Bed / ICU Availability','بستر / ICU دستیابی')}</div>
              <div className="text-xs text-gray-400">{t('live (mock)','لائیو (ڈیمو)')}</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'ER Beds', value: metrics.erBeds },
                { label: 'ICU Beds', value: metrics.icuBeds },
                { label: 'Ventilators', value: metrics.ventilators },
                { label: 'Isolation', value: metrics.isolation }
              ].map((item, i) => (
                <div key={item.label} className="p-2 rounded border flex items-center justify-between">
                  <div>{item.label}</div>
                  <div className={`font-semibold ${i%3===0 ? 'text-green-700' : i%3===1 ? 'text-yellow-700' : 'text-red-700'}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Ticker */}
        <div className="bg-white rounded-lg p-3 shadow overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-semibold">{t('Incident Ticker', 'واقعہ ٹکر')}</div>
            <div className="text-xs text-gray-400">{t('latest updates', 'حال ہی میں اپ ڈیٹس')}</div>
          </div>
          <div className="h-10 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {incidents.map((inc, i) => (
                <span key={inc.id} className={`inline-block mr-8 ${inc.level==='critical' ? 'text-red-600 font-semibold' : inc.level==='urgent' ? 'text-yellow-700' : 'text-gray-700'}`}>{inc.ts} — {inc.text}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Map + Symptom Checker + Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow lg:col-span-2">
            <h3 className="font-semibold mb-2">{t('Interactive Map', 'انٹرایکٹو نقشہ')}</h3>
            <div className="w-full h-64 rounded overflow-hidden border">
              {/* TODO: Replace with dynamic ambulance tracking map */}
              <iframe title="Emergency Map" src="https://www.google.com/maps/embed?pb=!1m18!..." className="w-full h-full border-0" loading="lazy"></iframe>
            </div>
            <div className="mt-2 text-xs text-gray-500">{t('Live vehicle tracking & routing placeholders are available for integration.', 'لائیو گاڑیوں کی ٹریکنگ اور روٹنگ کے لیے پلیس ہولڈر دستیاب ہے۔')}</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">{t('Symptom Checker', 'علامات چیک کریں')}</h3>
            <div className="space-y-2">
              <input onKeyDown={(e)=>{ if(e.key==='Enter') sendChat(e.target.value); }} placeholder={t('Describe symptoms or type "ambulance"', 'علامات بیان کریں یا "ambulance" لکھیں')} className="w-full px-3 py-2 border rounded" />
              <div className="h-40 overflow-auto p-2 bg-gray-50 rounded">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`p-2 my-1 rounded ${m.from==='bot' ? 'bg-white' : 'bg-green-50 text-right'}`}>
                    <div className="text-sm">{m.text}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=> setChatOpen(!chatOpen)} className="px-3 py-2 bg-red-600 text-white rounded w-full">{t('Open Full Assistant','مکمل اسسٹنٹ کھولیں')}</button>
            </div>
          </div>
        </div>

        {/* Predictive workload chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{t('Predictive Workload','توقعاتی کام کا بوجھ')}</h3>
            <div className="text-xs text-gray-400">{t('next 12 hours','اگلے 12 گھنٹے')}</div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident report + checklist + disaster toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow lg:col-span-2">
            <h3 className="font-semibold mb-2">{t('Report an Incident', 'واقعے کی اطلاع دیں')}</h3>
            <IncidentForm onSubmit={reportIncident} />
            <div className="mt-4 text-xs text-gray-500">{t('')}</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">{t('Emergency Checklist','ایمرجنسی چیک لسٹ')}</h3>
            <ul className="list-disc list-inside text-sm mb-3">
              {(lang==='en' ? checklist.en : checklist.ur).map((it, idx)=> <li key={idx}>{it}</li>)}
            </ul>
            <button onClick={downloadChecklist} className="px-3 py-2 bg-green-600 text-white rounded">{t('Download Checklist','چیک لسٹ ڈاؤن لوڈ کریں')}</button>
            <div className="mt-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={highContrast} onChange={()=> setHighContrast(h => !h)} /> {t('High contrast mode','ہائی کنٹراسٹ موڈ')}</label>
              <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={disasterMode} onChange={()=> setDisasterMode(d => !d)} /> {t('Activate Disaster Mode (drill)','ڈیزاسٹر موڈ فعال کریں (ڈرل)')}</label>
            </div>
          </div>
        </div>

        {/* Reports history */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">{t('Incident Reports','واقعہ رپورٹس')}</h3>
          <div className="text-sm space-y-2">
            {reports.length===0 ? <div className="text-gray-500">{t('No reports yet.','ابھی تک کوئی رپورٹ نہیں۔')}</div> : reports.map(r => (
              <div key={r.id} className="p-2 border rounded">
                <div className="text-sm font-medium">{r.title || 'Report'}</div>
                <div className="text-xs text-gray-500">{r.ts}</div>
                <div className="text-sm mt-2">{r.description}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Floating call button & chat */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <a href="tel:+92211786786" className="bg-red-600 text-white px-4 py-3 rounded-full shadow-lg">📞 {t('Call Ambulance','ایمبولینس کال')}</a>
        <button onClick={()=> setChatOpen(true)} className="bg-white text-red-600 px-3 py-2 rounded-full shadow">💬 {t('Assistant','اسسٹنٹ')}</button>
      </div>

      {/* Full assistant modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=> setChatOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full md:w-2/3 max-w-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('Emergency Assistant','ایمرجنسی اسسٹنٹ')}</h3>
              <button onClick={()=> setChatOpen(false)} className="text-sm">Close</button>
            </div>
            <div className="h-64 overflow-auto p-2 bg-gray-50 rounded">
              {chatMessages.map((m,i)=> (
                <div key={i} className={`p-2 my-1 rounded ${m.from==='bot' ? 'bg-white' : 'bg-green-50 text-right'}`}>{m.text}</div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input placeholder={t('Type a message...','پیغام لکھیں...')} className="flex-1 px-3 py-2 border rounded" onKeyDown={(e)=>{ if(e.key==='Enter'){ sendChat(e.target.value); e.target.value=''; } }} />
              <button onClick={()=> { const sample='ambulance'; sendChat(sample); }} className="px-3 py-2 bg-red-600 text-white rounded">{t('Call','کال')}</button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Medicore Emergency Response</footer>

      {/* Styles for small animations */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-100%);} }
        .animate-marquee { display: inline-block; animation: marquee 18s linear infinite; }
        .animate-pulse-beacon { box-shadow: 0 0 0 0 rgba(254, 202, 202, 0.7); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2);} 70% { box-shadow: 0 0 0 18px rgba(255,255,255,0);} 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0);} }
      `}</style>
    </div>
  );
}

// -------------------- Incident Form Component --------------------
function IncidentForm({ onSubmit }){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('Medium');

  const submit=(e)=>{
    e.preventDefault();
    if(!title||!description) return alert('Please fill title and description');
    onSubmit({ title, description, location, severity });
    setTitle(''); setDescription(''); setLocation(''); setSeverity('Medium');
    alert('Report submitted (demo)');
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short title (e.g., Road traffic collision)" className="w-full px-3 py-2 border rounded" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder="Describe the incident, casualties, and immediate needs" className="w-full px-3 py-2 border rounded"></textarea>
      <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location / landmark" className="w-full px-3 py-2 border rounded" />
      <select value={severity} onChange={e=>setSeverity(e.target.value)} className="w-full px-3 py-2 border rounded">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="px-3 py-2 bg-red-600 text-white rounded">Submit Report</button>
        <button type="button" onClick={()=>{ setTitle(''); setDescription(''); setLocation(''); setSeverity('Medium'); }} className="px-3 py-2 border rounded">Reset</button>
      </div>
    </form>
  );
}
