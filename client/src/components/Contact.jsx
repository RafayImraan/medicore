import React, { useState, useEffect } from "react";
import { commonAPI } from "../services/api";
import Toast from "./Toast";
import { MapPin, Phone, Mail, Globe, MessageCircle, Send, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "./ui/switch";

const Contact = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [queueLength, setQueueLength] = useState(3);
  const [responseTime, setResponseTime] = useState(2);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hi! I'm MediBot 🤖. How can I help you today?" },
  ]);
  const [supportAgents, setSupportAgents] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading] = useState({
    supportStats: false,
    agents: false,
    submit: false,
    chatbot: false,
  });

  // Fetch real stats
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

  // Fetch support agents
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

  // Handle chat mock response with API call
  const handleChatSend = async (msg) => {
    if (!msg.trim()) return;
    const newMsg = { sender: "user", text: msg };
    setChatMessages((prev) => [...prev, newMsg]);
    setLoading((prev) => ({ ...prev, chatbot: true }));
    try {
      const response = await commonAPI.sendChatMessage({ message: msg });
      setChatMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "(AI placeholder) I'm processing your request..." },
      ]);
    } finally {
      setLoading((prev) => ({ ...prev, chatbot: false }));
    }
  };

  // Handle form validation
  const validateForm = () => {
    let errs = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.message) errs.message = "Message cannot be empty";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading((prev) => ({ ...prev, submit: true }));
      try {
        await commonAPI.submitContactForm(formData);
        setToast({ show: true, message: language === "en" ? "Your message has been sent!" : "آپ کا پیغام بھیج دیا گیا ہے!", type: "success" });
        setFormData({ name: "", email: "", message: "" });
      } catch {
        setToast({ show: true, message: language === "en" ? "Failed to send message. Please try again." : "پیغام بھیجنے میں ناکامی۔ دوبارہ کوشش کریں۔", type: "error" });
      } finally {
        setLoading((prev) => ({ ...prev, submit: false }));
      }
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "en" ? "ur" : "en");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-charcoal-950 text-primary-50 font-inter`}
    >
      {/* Hero Section */}
      <motion.section
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden py-24 text-center bg-gradient-to-br from-primary-900 via-primary-800 to-charcoal-900"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-4 h-4 bg-accent-500 rounded-full opacity-20"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-6 h-6 bg-primary-400 rounded-full opacity-15"
          />
          <motion.div
            animate={{ x: [0, 120, 0], y: [0, -40, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-1/4 w-3 h-3 bg-accent-400 rounded-full opacity-25"
          />
        </div>

        {/* Glass Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mx-auto max-w-4xl p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-100 bg-clip-text text-transparent"
          >
            {language === "en" ? "Contact Us" : "ہم سے رابطہ کریں"}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-primary-100 leading-relaxed"
          >
            {language === "en"
              ? "We’re here to help — reach out with any questions, feedback, or medical concerns."
              : "ہم آپ کی مدد کے لیے یہاں ہیں — کسی بھی سوال، رائے، یا طبی خدشات کے ساتھ رابطہ کریں۔"}
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex justify-center items-center gap-6 py-8"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-400">
            {language === "en" ? "Dark Mode" : "ڈارک موڈ"}
          </span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-accent-500 data-[state=unchecked]:bg-charcoal-600"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-primary-50 hover:bg-white/20 transition-all duration-300 shadow-lg"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "اردو" : "English"}
        </motion.button>
      </motion.div>

      {/* Contact Info Grid */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="py-16"
      >
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Location Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl hover:shadow-accent-500/20 hover:border-accent-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 mx-auto shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-50 mb-4 text-center">
                {language === "en" ? "Location" : "مقام"}
              </h3>
              <div className="text-center space-y-2 text-muted-200">
                <p className="font-medium">Stadium Road, Karachi</p>
                <p>Pakistan 74800</p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <motion.div
                  animate={{
                    scale: new Date().getHours() >= 9 && new Date().getHours() < 17 ? [1, 1.2, 1] : 1,
                    opacity: new Date().getHours() >= 9 && new Date().getHours() < 17 ? [0.7, 1, 0.7] : 0.5
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${new Date().getHours() >= 9 && new Date().getHours() < 17 ? 'bg-accent-500' : 'bg-accent-700'}`}
                />
                <span className="text-sm font-medium">
                  {new Date().getHours() >= 9 && new Date().getHours() < 17 ? (language === "en" ? "Open Now" : "ابھی کھلا ہے") : (language === "en" ? "Closed" : "بند")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Call Us Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl hover:shadow-accent-500/20 hover:border-accent-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 mx-auto shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-50 mb-4 text-center">
                {language === "en" ? "Call Us" : "ہم سے کال کریں"}
              </h3>
              <div className="text-center space-y-2 text-muted-200">
                <p className="font-medium">+92 21 111 911 911</p>
                <p className="text-sm">{language === "en" ? "Emergency:" : "ہنگامی:"} +92 21 111 786 786</p>
              </div>
              <div className="mt-6 text-center">
                <motion.p
                  animate={{ opacity: loading.supportStats ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 1.5, repeat: loading.supportStats ? Infinity : 0 }}
                  className="text-sm text-muted-300"
                >
                  {language === "en" ? "Avg. Response:" : "اوسط جواب:"} {loading.supportStats ? (language === "en" ? "Loading..." : "لوڈ ہو رہا ہے...") : `${responseTime} min`}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Email Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl hover:shadow-accent-500/20 hover:border-accent-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 mx-auto shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-50 mb-4 text-center">
                {language === "en" ? "Email" : "ای میل"}
              </h3>
              <div className="text-center space-y-2 text-muted-200">
                <p className="font-medium">info@medicore.org</p>
                <p className="text-sm">appointments@medicore.org</p>
              </div>
              <div className="mt-6 text-center">
                <motion.p
                  animate={{ opacity: loading.supportStats ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 1.5, repeat: loading.supportStats ? Infinity : 0 }}
                  className="text-sm text-muted-300"
                >
                  {language === "en" ? "Queue length:" : "قطار کی لمبائی:"} {loading.supportStats ? (language === "en" ? "Loading..." : "لوڈ ہو رہا ہے...") : queueLength}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Support Agents */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="py-16 bg-gradient-to-b from-charcoal-900 to-charcoal-950"
      >
        <div className="max-w-screen-lg mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-primary-50"
          >
            {language === "en" ? "Live Support Agents" : "لائیو سپورٹ ایجنٹس"}
          </motion.h2>
          {loading.agents ? (
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
              />
            </div>
          ) : supportAgents.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {supportAgents.map((agent, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 + idx * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-accent-500/20 hover:border-accent-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg"
                      />
                      <motion.div
                        animate={{
                          scale: agent.available ? [1, 1.2, 1] : 1,
                          opacity: agent.available ? [0.7, 1, 0.7] : 0.5
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          agent.available ? 'bg-accent-500' : 'bg-accent-700'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-primary-50 text-lg">{agent.name}</p>
                      <p className={`text-sm font-medium ${agent.available ? "text-accent-400" : "text-accent-600"}`}>
                        {agent.available ? (language === "en" ? "Available" : "دستیاب") : (language === "en" ? "Busy" : "مصروف")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-300">No agents available right now.</div>
          )}
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="py-20 bg-gradient-to-b from-charcoal-950 to-charcoal-900"
      >
        <div className="max-w-screen-md mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-primary-50"
          >
            {language === "en" ? "Send Us a Message" : "ہم کو پیغام بھیجیں"}
          </motion.h2>
          <motion.form
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl text-primary-50 placeholder-transparent focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 peer"
                placeholder={language === "en" ? "Full Name" : "پورا نام"}
                disabled={loading.submit}
              />
              <label className="absolute left-4 top-3 text-muted-400 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-muted-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent-400 peer-focus:-translate-y-1 peer-focus:px-1 peer-focus:bg-charcoal-950">
                {language === "en" ? "Full Name" : "پورا نام"}
              </label>
              {errors.name && <p className="text-accent-500 text-sm mt-1">{language === "en" ? errors.name : "نام ضروری ہے"}</p>}
            </div>

            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl text-primary-50 placeholder-transparent focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 peer"
                placeholder={language === "en" ? "Email Address" : "ای میل ایڈریس"}
                disabled={loading.submit}
              />
              <label className="absolute left-4 top-3 text-muted-400 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-muted-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent-400 peer-focus:-translate-y-1 peer-focus:px-1 peer-focus:bg-charcoal-950">
                {language === "en" ? "Email Address" : "ای میل ایڈریس"}
              </label>
              {errors.email && <p className="text-accent-500 text-sm mt-1">{language === "en" ? errors.email : "ای میل ضروری ہے"}</p>}
            </div>

            <div className="relative">
              <textarea
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl text-primary-50 placeholder-transparent focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-300 peer resize-none"
                placeholder={language === "en" ? "Your Message" : "آپ کا پیغام"}
                disabled={loading.submit}
              />
              <label className="absolute left-4 top-3 text-muted-400 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-muted-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent-400 peer-focus:-translate-y-1 peer-focus:px-1 peer-focus:bg-charcoal-950">
                {language === "en" ? "Your Message" : "آپ کا پیغام"}
              </label>
              {errors.message && <p className="text-accent-500 text-sm mt-1">{language === "en" ? errors.message : "پیغام خالی نہیں ہو سکتا"}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading.submit}
            >
              {loading.submit ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  {language === "en" ? "Sending..." : "بھیج رہا ہے..."}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {language === "en" ? "Submit" : "جمع کریں"}
                </div>
              )}
            </motion.button>
          </motion.form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-6 text-center text-xs text-muted-400"
          >
            {language === "en" ? "This form is protected by AI-based spam detection." : "یہ فارم AI پر مبنی سپیم کی پہچان سے محفوظ ہے۔"}
          </motion.p>
        </div>
      </motion.section>

      {/* Map + Branches */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="py-16 bg-gradient-to-b from-charcoal-950 to-charcoal-900"
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-primary-50"
          >
            {language === "en" ? "Our Location" : "ہمارا مقام"}
          </motion.h2>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="w-full h-96 rounded-xl overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Stadium%20Road,%20Karachi,%20Pakistan&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Medicore Health Services Location"
                className="rounded-xl"
              />
            </div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.6 }}
              className="absolute top-6 left-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-bold text-primary-50 mb-2">
                {language === "en" ? "Medicore Hospital" : "میڈیکور ہسپتال"}
              </h3>
              <p className="text-sm text-muted-200">
                Stadium Road, Karachi<br />
                Pakistan 74800
              </p>
              <div className="mt-3 flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: new Date().getHours() >= 9 && new Date().getHours() < 17 ? [1, 1.2, 1] : 1,
                    opacity: new Date().getHours() >= 9 && new Date().getHours() < 17 ? [0.7, 1, 0.7] : 0.5
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${new Date().getHours() >= 9 && new Date().getHours() < 17 ? 'bg-accent-500' : 'bg-accent-700'}`}
                />
                <span className="text-sm font-medium">
                  {new Date().getHours() >= 9 && new Date().getHours() < 17 ? (language === "en" ? "Open Now" : "ابھی کھلا ہے") : (language === "en" ? "Closed" : "بند")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Chatbot Widget */}
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatVisible(!chatVisible)}
            className="relative w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full shadow-2xl flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-accent-500 rounded-full opacity-50"
            />
            <MessageCircle className="w-6 h-6 text-white relative z-10" />
          </motion.button>

          {chatVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-16 right-0 w-80 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-primary-50 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  MediBot
                </h3>
                <p className="text-sm text-muted-200">
                  {language === "en" ? "How can I help you today?" : "آج آپ کی کیا مدد کر سکتا ہوں؟"}
                </p>
              </div>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {chatMessages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex ${m.sender === "bot" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          m.sender === "bot"
                            ? "bg-white/10 text-primary-50 border border-white/20"
                            : "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={language === "en" ? "Type a message..." : "پیغام ٹائپ کریں..."}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleChatSend(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-primary-50 placeholder-muted-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    disabled={loading.chatbot}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Type a message"]');
                      if (input && input.value.trim()) {
                        handleChatSend(input.value);
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
                    disabled={loading.chatbot}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="relative overflow-hidden py-16 mt-20 bg-gradient-to-t from-primary-900 via-primary-800 to-charcoal-900"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, -200, 0], y: [0, 100, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-8 h-8 bg-accent-500 rounded-full opacity-10"
          />
          <motion.div
            animate={{ x: [0, 150, 0], y: [0, -80, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-1/4 w-6 h-6 bg-primary-400 rounded-full opacity-15"
          />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.6 }}
            className="mb-8"
          >
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-primary-50 mb-4"
            >
              {language === "en" ? "Medicore Health Services" : "میڈیکور ہیلتھ سروسز"}
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.6 }}
              className="text-muted-200 mb-6"
            >
              {language === "en" ? "Committed to Excellence in Healthcare" : "ہیلتھ کیئر میں ایکسلینس کے لیے پرعزم"}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="space-y-4"
          >
            <motion.p
              whileHover={{ scale: 1.02 }}
              className="text-sm text-muted-300"
            >
              {language === "en" ? "Accredited by Joint Commission International (JCI)" : "جوائنٹ کمیشن انٹرنیشنل (JCI) سے منظور شدہ"}
            </motion.p>
            <motion.p
              whileHover={{ scale: 1.02 }}
              className="text-xs text-muted-400"
            >
              © {new Date().getFullYear()} {language === "en" ? "Medicore Health Services – All Rights Reserved" : "میڈیکور ہیلتھ سروسز – تمام حقوق محفوظ ہیں"}
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Contact;
