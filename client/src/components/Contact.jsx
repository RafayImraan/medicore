import React, { useEffect, useState } from "react";
import { commonAPI } from "../services/api";
import Toast from "./Toast";
import { MapPin, Phone, Mail, Globe, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

const Contact = () => {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [queueLength, setQueueLength] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Welcome to Medicore support. How can we help you today?" },
  ]);
  const [supportAgents, setSupportAgents] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading] = useState({
    supportStats: false,
    agents: false,
    submit: false,
    chatbot: false,
  });

  useEffect(() => {
    const fetchSupportStats = async () => {
      setLoading((prev) => ({ ...prev, supportStats: true }));
      try {
        const data = await commonAPI.getSupportStats();
        setQueueLength(data.queueLength || 0);
        setResponseTime(data.responseTime || 0);
      } catch {
        setQueueLength(0);
        setResponseTime(0);
      } finally {
        setLoading((prev) => ({ ...prev, supportStats: false }));
      }
    };

    fetchSupportStats();
    const interval = setInterval(fetchSupportStats, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading((prev) => ({ ...prev, agents: true }));
      try {
        const agents = await commonAPI.getAgents();
        setSupportAgents(Array.isArray(agents) ? agents : []);
      } catch {
        setSupportAgents([]);
      } finally {
        setLoading((prev) => ({ ...prev, agents: false }));
      }
    };
    fetchAgents();
  }, []);

  const copy = {
    en: {
      title: "Contact Medicore",
      intro: "Speak with admissions, patient support, or our emergency coordination team through one professional contact hub.",
      submitSuccess: "Your message has been sent.",
      submitError: "We could not send your message. Please try again.",
    },
    ur: {
      title: "Contact Medicore",
      intro: "Speak with admissions, patient support, or our emergency coordination team through one professional contact hub.",
      submitSuccess: "Your message has been sent.",
      submitError: "We could not send your message. Please try again.",
    },
  }[language];

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.message.trim()) nextErrors.message = "Message is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      await commonAPI.submitContactForm(formData);
      setToast({ show: true, message: copy.submitSuccess, type: "success" });
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch {
      setToast({ show: true, message: copy.submitError, type: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const outgoing = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: outgoing }]);
    setChatInput("");
    setLoading((prev) => ({ ...prev, chatbot: true }));
    try {
      const response = await commonAPI.sendChatMessage({ message: outgoing });
      setChatMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Support is reviewing your request. A coordinator will respond shortly." },
      ]);
    } finally {
      setLoading((prev) => ({ ...prev, chatbot: false }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Globe className="h-4 w-4" />
              Premium care support
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white">{copy.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setLanguage(language === "en" ? "ur" : "en")} className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200">
                {language === "en" ? "Switch to Urdu" : "Switch to English"}
              </button>
            </div>
          </div>

          <Panel>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <MapPin className="h-5 w-5 text-accent-300" />
                <p className="mt-4 text-sm font-medium text-white">Location</p>
                <p className="mt-2 text-sm text-slate-400">Stadium Road, Karachi</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <Phone className="h-5 w-5 text-accent-300" />
                <p className="mt-4 text-sm font-medium text-white">Phone</p>
                <p className="mt-2 text-sm text-slate-400">+92 21 111 911 911</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <Mail className="h-5 w-5 text-accent-300" />
                <p className="mt-4 text-sm font-medium text-white">Email</p>
                <p className="mt-2 text-sm text-slate-400">info@medicore.org</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Average response</p>
                <p className="mt-3 text-3xl font-semibold text-white">{loading.supportStats ? "--" : responseTime}</p>
                <p className="mt-1 text-sm text-slate-400">minutes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active queue</p>
                <p className="mt-3 text-3xl font-semibold text-white">{loading.supportStats ? "--" : queueLength}</p>
                <p className="mt-1 text-sm text-slate-400">open conversations</p>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel>
            <h2 className="text-2xl font-semibold text-white">Live support agents</h2>
            <p className="mt-2 text-sm text-slate-400">Dedicated coordinators for admissions, scheduling, and patient follow-up.</p>
            <div className="mt-6 grid gap-4">
              {loading.agents ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-white/5" />
                ))
              ) : supportAgents.length ? (
                supportAgents.map((agent, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <img src={agent.avatar} alt={agent.name} className="h-14 w-14 rounded-full border border-white/10 object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className={`mt-1 text-sm ${agent.available ? "text-emerald-300" : "text-amber-300"}`}>
                        {agent.available ? "Available now" : "Currently assisting another patient"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4 text-sm text-slate-400">No agents available right now.</div>
              )}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-2xl font-semibold text-white">Send a message</h2>
            <p className="mt-2 text-sm text-slate-400">Use this form for general questions, care coordination, and non-emergency guidance.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                {errors.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
              </div>
              <div>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email}</p>}
              </div>
              <div>
                <textarea rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="How can we help?" className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                {errors.message && <p className="mt-1 text-sm text-rose-400">{errors.message}</p>}
              </div>
              <button type="submit" disabled={loading.submit} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
                {loading.submit ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Panel className="overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-2xl font-semibold text-white">Hospital location</h2>
              <p className="mt-2 text-sm text-slate-400">A direct map view for admissions, parking, and ambulance arrivals.</p>
              <div className="mt-6 h-80 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src="https://maps.google.com/maps?q=Stadium%20Road,%20Karachi,%20Pakistan&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(1) hue-rotate(180deg)" }}
                  loading="lazy"
                  title="Medicore Hospital Location"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Address</p>
                <p className="mt-3 text-sm text-slate-300">Stadium Road, Karachi, Pakistan 74800</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Hours</p>
                <p className="mt-3 text-sm text-slate-300">Admissions support: 9am to 5pm</p>
                <p className="mt-1 text-sm text-slate-300">Emergency services: 24/7</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Accreditation</p>
                <p className="mt-3 text-sm text-slate-300">Designed for enterprise-grade patient communication and hospital operations.</p>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <AnimatePresence>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="fixed bottom-6 right-6 z-50">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setChatVisible((value) => !value)} className="rounded-full bg-gradient-to-r from-accent-500 to-accent-400 px-5 py-4 text-white shadow-2xl shadow-accent-950/40">
            <MessageCircle className="h-5 w-5" />
          </motion.button>

          {chatVisible && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 right-0 w-80 overflow-hidden rounded-2xl border border-white/10 bg-charcoal-950/95 shadow-2xl">
              <div className="border-b border-white/10 bg-white/5 px-4 py-3">
                <p className="font-semibold text-white">MediBot Support</p>
                <p className="mt-1 text-sm text-slate-400">Quick guidance while the team prepares a human response.</p>
              </div>
              <div className="h-64 space-y-3 overflow-y-auto px-4 py-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === "bot" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.sender === "bot" ? "bg-white/10 text-slate-200" : "bg-primary-600 text-white"}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-white/10 p-4">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleChatSend()} placeholder="Type a message..." className="flex-1 rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white" />
                <button onClick={handleChatSend} disabled={loading.chatbot} className="rounded-xl bg-accent-500 px-4 py-3 text-white disabled:opacity-60">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </motion.div>
  );
};

export default Contact;
