import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { commonAPI } from "../services/api";
import Toast from "./Toast";

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

  // Rotate fake stats and fetch real stats
  useEffect(() => {
    const fetchSupportStats = async () => {
      setLoading((prev) => ({ ...prev, supportStats: true }));
      try {
        const data = await commonAPI.getSupportStats();
        setQueueLength(data.queueLength);
        setResponseTime(data.responseTime);
      } catch {
        // fallback to random
        setQueueLength(Math.floor(Math.random() * 10));
        setResponseTime(Math.floor(Math.random() * 5) + 1);
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
        if (agents.length > 0) {
          setSupportAgents(agents);
        } else {
          // fallback to faker data
          setSupportAgents(
            Array.from({ length: 3 }, () => ({
              name: faker.person.firstName(),
              avatar: faker.image.avatar(),
              available: faker.datatype.boolean(),
            }))
          );
        }
      } catch {
        setSupportAgents(
          Array.from({ length: 3 }, () => ({
            name: faker.person.firstName(),
            avatar: faker.image.avatar(),
            available: faker.datatype.boolean(),
          }))
        );
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
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-2">
          {language === "en" ? "Contact Us" : "ہم سے رابطہ کریں"}
        </h1>
        <p>
          {language === "en"
            ? "We’re here to help — reach out with any questions, feedback, or medical concerns."
            : "ہم آپ کی مدد کے لیے یہاں ہیں — کسی بھی سوال، رائے، یا طبی خدشات کے ساتھ رابطہ کریں۔"}
        </p>
      </section>

      {/* Controls */}
      <div className="flex justify-center gap-4 py-4">
        <button onClick={toggleDarkMode} className="px-4 py-2 bg-green-600 text-white rounded-md">
          {darkMode ? (language === "en" ? "Light Mode" : "لائٹ موڈ") : (language === "en" ? "Dark Mode" : "ڈارک موڈ")}
        </button>
        <button onClick={toggleLanguage} className="px-4 py-2 bg-green-600 text-white rounded-md">
          {language === "en" ? "Switch to Urdu" : "Switch to English"}
        </button>
      </div>

      {/* Contact Info Grid */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📍 {language === "en" ? "Location" : "مقام"}</h3>
            <p>Stadium Road, Karachi</p>
            <p>Pakistan 74800</p>
            <p className="mt-2 text-xs">
              {language === "en" ? "Status:" : "حالت:"} {new Date().getHours() >= 9 && new Date().getHours() < 17 ? (language === "en" ? "Open Now" : "ابھی کھلا ہے") : (language === "en" ? "Closed" : "بند")}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📞 {language === "en" ? "Call Us" : "ہم سے کال کریں"}</h3>
            <p>+92 21 111 911 911</p>
            <p>{language === "en" ? "Emergency:" : "ہنگامی:"} +92 21 111 786 786</p>
            <p className="mt-2 text-xs">
              {language === "en" ? "Avg. Response:" : "اوسط جواب:"} {loading.supportStats ? (language === "en" ? "Loading..." : "لوڈ ہو رہا ہے...") : responseTime + " min"}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📧 {language === "en" ? "Email" : "ای میل"}</h3>
            <p>info@medicore.org</p>
            <p>appointments@medicore.org</p>
            <p className="mt-2 text-xs">
              {language === "en" ? "Queue length:" : "قطار کی لمبائی:"} {loading.supportStats ? (language === "en" ? "Loading..." : "لوڈ ہو رہا ہے...") : queueLength}
            </p>
          </div>
        </div>
      </section>

      {/* Support Agents */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-lg mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">{language === "en" ? "Live Support Agents" : "لائیو سپورٹ ایجنٹس"}</h2>
          {loading.agents ? (
            <p>{language === "en" ? "Loading agents..." : "ایجنٹس لوڈ ہو رہے ہیں..."}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {supportAgents.map((agent, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
                >
                  <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className={`text-sm ${agent.available ? "text-green-600" : "text-red-500"}`}>
                      {agent.available ? (language === "en" ? "Available" : "دستیاب") : (language === "en" ? "Busy" : "مصروف")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-md mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-6">{language === "en" ? "Send Us a Message" : "ہم کو پیغام بھیجیں"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={language === "en" ? "Full Name" : "پورا نام"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              disabled={loading.submit}
            />
            {errors.name && <p className="text-red-500 text-sm">{language === "en" ? errors.name : "نام ضروری ہے"}</p>}
            <input
              type="email"
              placeholder={language === "en" ? "Email Address" : "ای میل ایڈریس"}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              disabled={loading.submit}
            />
            {errors.email && <p className="text-red-500 text-sm">{language === "en" ? errors.email : "ای میل ضروری ہے"}</p>}
            <textarea
              rows="4"
              placeholder={language === "en" ? "Your Message" : "آپ کا پیغام"}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              disabled={loading.submit}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm">{language === "en" ? errors.message : "پیغام خالی نہیں ہو سکتا"}</p>}
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md"
              disabled={loading.submit}
            >
              {loading.submit ? (language === "en" ? "Sending..." : "بھیج رہا ہے...") : (language === "en" ? "Submit" : "جمع کریں")}
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500">
            {language === "en" ? "This form is protected by AI-based spam detection (placeholder)." : "یہ فارم AI پر مبنی سپیم کی پہچان سے محفوظ ہے (placeholder)."}
          </p>
        </div>
      </section>

      {/* Map + Branches */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 text-center">
        <h2 className="text-xl font-semibold mb-4">{language === "en" ? "Our Location" : "ہمارا مقام"}</h2>
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=Stadium%20Road,%20Karachi,%20Pakistan&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Medicore Health Services Location"
          ></iframe>
        </div>
      </section>

      {/* AI Chatbot Widget */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setChatVisible(!chatVisible)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg"
        >
          💬
        </button>
        {chatVisible && (
          <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4">
            <div className="h-64 overflow-y-auto space-y-2">
              {chatMessages.map((m, i) => (
                <div key={i} className={`${m.sender === "bot" ? "text-left" : "text-right"}`}>
                  <p
                    className={`inline-block px-3 py-2 rounded-lg ${
                      m.sender === "bot" ? "bg-gray-200" : "bg-green-600 text-white"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder={language === "en" ? "Type a message..." : "پیغام ٹائپ کریں..."}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChatSend(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full px-3 py-2 border rounded-md mt-2"
              disabled={loading.chatbot}
            />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-8 mt-12">
        <p className="text-sm">Accredited by Joint Commission International (JCI)</p>
        <p className="mt-2">© Medicore Health Services – All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Contact;
