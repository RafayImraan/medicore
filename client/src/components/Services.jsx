import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  CalendarDays,
  FlaskConical,
  CreditCard,
  Home,
  Star,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  Heart,
  Filter,
  MessageCircle,
  X,
  Send,
  Play,
  Check,
  Award,
  Shield,
  Lock,
  Zap,
  Users,
  Gift,
  Download,
  Mail,
  Bell,
  Settings,
  BarChart2,
  ZoomIn,
  ZoomOut,
  Contrast,
  Sparkles,
  Clock,
  DollarSign,
  HelpCircle,
  Building2,
  BadgeCheck,
  FileText,
  Phone,
  Video,
  Search,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

// Floating Shapes Component
const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
      animate={{
        x: [0, -30, 0],
        y: [0, 50, 0],
        scale: [1, 0.9, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"
      animate={{
        x: [0, 40, -40, 0],
        y: [0, -40, 40, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Gradient Wave Component
const GradientWave = () => (
  <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="absolute bottom-0 w-full h-full"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
        fill="url(#waveGradient)"
        animate={{
          d: [
            "M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z",
            "M0,80 C200,40 400,100 600,60 C800,20 1000,80 1200,40 L1200,120 L0,120 Z",
            "M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

// Scroll-triggered Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Glow Button Component
const GlowButton = ({ children, onClick, variant = "primary", className = "", disabled = false }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
      variant === "primary"
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40"
        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.6 }}
    />
  </motion.button>
);

// Floating Chat Component
const FloatingChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! How can I help you today? Ask me about our services!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // AI-like response simulation
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Our team specializes in comprehensive healthcare solutions.",
        "Great question! Our services are designed with your health in mind. Would you like more details?",
        "I can help you find the right service. What specific healthcare needs do you have?",
        "Our telemedicine services are available 24/7. Would you like me to explain the booking process?",
      ];
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">AI Assistant</h4>
                <p className="text-white/80 text-xs">Online • Ready to help</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-56 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-green-500 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Quiz Component for Service Recommendation
const ServiceQuiz = ({ isOpen, onClose, onResult }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      question: "What type of healthcare service are you looking for?",
      options: ["Consultation", "Lab Work", "Ongoing Care", "Mental Health"],
    },
    {
      question: "How urgently do you need the service?",
      options: ["Immediately", "Within a week", "Flexible", "Regular checkup"],
    },
    {
      question: "Preferred mode of service?",
      options: ["In-person", "Virtual/Online", "Home Visit", "Any"],
    },
    {
      question: "What's your budget range?",
      options: ["Free options", "Under $25", "$25-$50", "Flexible"],
    },
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate recommendation
      let category = "Appointments";
      if (newAnswers.includes("Mental Health")) category = "Mental Health";
      else if (newAnswers.includes("Lab Work")) category = "Reports";
      else if (newAnswers.includes("Home Visit")) category = "Home Care";
      else if (newAnswers.includes("Virtual/Online")) category = "Telemedicine";
      
      onResult(category);
      onClose();
      setStep(0);
      setAnswers([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Find Your Perfect Service</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i <= step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-lg font-medium dark:text-white mb-4">
                {questions[step].question}
              </p>
              <div className="space-y-3">
                {questions[step].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left border rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 dark:border-gray-600 dark:text-white transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pricing Calculator Component
const PricingCalculator = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState(1);
  const [planType, setPlanType] = useState("basic");
  const [includeHomeVisit, setIncludeHomeVisit] = useState(false);

  const basePrice = planType === "premium" ? 50 : 15;
  const homeVisitCost = includeHomeVisit ? 25 * sessions : 0;
  const discount = sessions >= 5 ? 0.1 : sessions >= 3 ? 0.05 : 0;
  const subtotal = basePrice * sessions + homeVisitCost;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const emi = total / 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Cost Calculator
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Plan Type */}
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">Plan Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlanType("basic")}
                    className={`flex-1 p-3 rounded-lg border transition ${
                      planType === "basic"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <span className="dark:text-white">Basic ($15/session)</span>
                  </button>
                  <button
                    onClick={() => setPlanType("premium")}
                    className={`flex-1 p-3 rounded-lg border transition ${
                      planType === "premium"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <span className="dark:text-white">Premium ($50/session)</span>
                  </button>
                </div>
              </div>

              {/* Sessions */}
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">
                  Number of Sessions: {sessions}
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={sessions}
                  onChange={(e) => setSessions(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
                {sessions >= 3 && (
                  <p className="text-xs text-green-600 mt-1">
                    🎉 {discount * 100}% bulk discount applied!
                  </p>
                )}
              </div>

              {/* Home Visit */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHomeVisit}
                  onChange={(e) => setIncludeHomeVisit(e.target.checked)}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="dark:text-white">Include Home Visits (+$25/session)</span>
              </label>

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount * 100}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold dark:text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                  Or pay in 3 installments of ${emi.toFixed(2)}/month
                </div>
              </div>

              <GlowButton className="w-full">Proceed to Payment</GlowButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated Timeline Component
const WorkflowTimeline = () => {
  const steps = [
    { icon: <Search className="w-5 h-5" />, title: "Discover", desc: "Browse our services" },
    { icon: <CalendarDays className="w-5 h-5" />, title: "Book", desc: "Schedule appointment" },
    { icon: <Video className="w-5 h-5" />, title: "Consult", desc: "Meet with specialist" },
    { icon: <FileText className="w-5 h-5" />, title: "Receive", desc: "Get your reports" },
    { icon: <Heart className="w-5 h-5" />, title: "Follow-up", desc: "Ongoing care" },
  ];

  return (
    <div className="py-12">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center dark:text-white mb-8">How It Works</h3>
      </ScrollReveal>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <ScrollReveal delay={i * 0.1}>
              <motion.div
                className="flex flex-col items-center text-center p-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white mb-3 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.icon}
                </motion.div>
                <h4 className="font-semibold dark:text-white">{step.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            </ScrollReveal>
            {i < steps.length - 1 && (
              <motion.div
                className="hidden md:block w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Testimonials Carousel
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      text: "The telemedicine service saved me a trip to the ER. Got immediate help from my phone!",
      author: "Jennifer K.",
      role: "Patient",
      rating: 5,
      video: null,
    },
    {
      text: "Mental health support here is exceptional. The therapists are truly compassionate.",
      author: "Michael R.",
      role: "Patient",
      rating: 5,
      video: null,
    },
    {
      text: "Home health services made my recovery so much easier. Highly recommended!",
      author: "Sarah L.",
      role: "Patient",
      rating: 5,
      video: null,
    },
    {
      text: "Quick lab results and easy to understand reports. Best healthcare platform!",
      author: "David M.",
      role: "Patient",
      rating: 5,
      video: "placeholder",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <ScrollReveal>
      <div className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center dark:text-white mb-8">What Our Patients Say</h3>
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {testimonials[activeIndex].author[0]}
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">{testimonials[activeIndex].author}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[activeIndex].role}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                {testimonials[activeIndex].video && (
                  <button className="ml-auto p-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition">
                    <Play className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                "{testimonials[activeIndex].text}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeIndex ? "bg-green-500 w-8" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

// Client Logos Section
const ClientLogos = () => {
  const logos = ["Hospital A", "Clinic B", "Lab Corp", "MedCare", "HealthPlus", "CareStar"];

  return (
    <ScrollReveal>
      <div className="py-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by leading healthcare providers</p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Building2 className="w-5 h-5 text-green-500" />
              <span className="font-medium dark:text-white">{logo}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

// Statistics Section
const StatisticsSection = () => {
  const stats = [
    { value: "50K+", label: "Patients Served", icon: <Users className="w-6 h-6" /> },
    { value: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
    { value: "4.9/5", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
    { value: "24/7", label: "Availability", icon: <Clock className="w-6 h-6" /> },
  ];

  return (
    <ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </ScrollReveal>
  );
};

// Pricing Plans Section
const PricingSection = ({ onCalculatorOpen }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Basic",
      price: billingCycle === "monthly" ? 0 : 0,
      features: ["Basic consultations", "Lab report access", "Email support", "2 appointments/month"],
      popular: false,
    },
    {
      name: "Premium",
      price: billingCycle === "monthly" ? 29 : 290,
      features: ["Unlimited consultations", "Priority scheduling", "24/7 support", "Home visits included", "Mental health support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? 99 : 990,
      features: ["Everything in Premium", "Dedicated care manager", "Family coverage (5 members)", "Annual health checkup", "Emergency hotline"],
      popular: false,
    },
  ];

  return (
    <ScrollReveal>
      <div className="py-12">
        <h3 className="text-2xl font-bold text-center dark:text-white mb-4">Flexible Pricing Plans</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Choose the plan that fits your needs</p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className={`text-sm ${billingCycle === "monthly" ? "text-green-600 font-semibold" : "text-gray-500"}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-green-500 rounded-full"
              animate={{ left: billingCycle === "monthly" ? 4 : 32 }}
            />
          </button>
          <span className={`text-sm ${billingCycle === "yearly" ? "text-green-600 font-semibold" : "text-gray-500"}`}>
            Yearly <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">Save 17%</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 ${
                plan.popular ? "border-green-500" : "border-gray-100 dark:border-gray-700"
              }`}
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Best Value
                </div>
              )}
              <h4 className="text-xl font-bold dark:text-white">{plan.name}</h4>
              <div className="my-4">
                <span className="text-4xl font-bold text-green-600">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <GlowButton 
                variant={plan.popular ? "primary" : "secondary"} 
                className="w-full"
              >
                Get Started
              </GlowButton>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={onCalculatorOpen}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto"
          >
            <DollarSign className="w-4 h-4" />
            Calculate Custom Pricing
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

// Trust & Certifications Section
const TrustSection = () => {
  const certifications = [
    { icon: <Shield className="w-6 h-6" />, name: "HIPAA Compliant", desc: "Data privacy assured" },
    { icon: <Lock className="w-6 h-6" />, name: "SOC 2 Certified", desc: "Security verified" },
    { icon: <BadgeCheck className="w-6 h-6" />, name: "JCI Accredited", desc: "Quality healthcare" },
    { icon: <Award className="w-6 h-6" />, name: "ISO 27001", desc: "Information security" },
  ];

  return (
    <ScrollReveal>
      <div className="py-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl px-6">
        <h3 className="text-2xl font-bold text-center dark:text-white mb-2">Trust & Compliance</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Your security is our priority</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                {cert.icon}
              </div>
              <h4 className="font-semibold dark:text-white text-sm">{cert.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{cert.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-green-600">30-day money-back guarantee</span> • Full refund if not satisfied
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-green-600">SLA: 99.9% uptime</span> • Response within 5 minutes
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <ScrollReveal>
      <div className="py-12">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 text-center text-white">
          <Gift className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Get Free Health Resources</h3>
          <p className="text-white/80 mb-6">Subscribe for exclusive tips, guides, and special offers</p>
          
          {subscribed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/20 rounded-xl p-4 max-w-md mx-auto"
            >
              <Check className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Thanks for subscribing!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400"
                required
              />
              <GlowButton className="bg-white text-green-600 hover:bg-gray-100">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Subscribe
                </span>
              </GlowButton>
            </form>
          )}

          <div className="flex justify-center gap-6 mt-6">
            <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <Download className="w-4 h-4" />
              Free Guide PDF
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <FileText className="w-4 h-4" />
              Health Checklist
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

// Accessibility Toolbar
const AccessibilityToolbar = ({ fontSize, setFontSize, highContrast, setHighContrast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        aria-label="Accessibility options"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-12 top-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 w-48 border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold dark:text-white mb-3 text-sm">Accessibility</h4>
            
            {/* Font Size */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Text Size</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded"
                  aria-label="Decrease text size"
                >
                  <ZoomOut className="w-4 h-4 dark:text-white" />
                </button>
                <span className="text-sm dark:text-white flex-1 text-center">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded"
                  aria-label="Increase text size"
                >
                  <ZoomIn className="w-4 h-4 dark:text-white" />
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="accent-blue-600"
                />
                <span className="text-sm dark:text-white flex items-center gap-1">
                  <Contrast className="w-4 h-4" />
                  High Contrast
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Notification Toast
const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}
    >
      <Bell className="w-5 h-5" />
      <span className="flex-1">{notification.message}</span>
      <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Compare Services Modal
const CompareModal = ({ services, onClose }) => {
  if (services.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-white">Compare Services</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>
        <div className="overflow-auto p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 dark:text-white">Feature</th>
                {services.map((s) => (
                  <th key={s.id} className="text-left p-3 dark:text-white">{s.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">Price</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white font-semibold text-green-600">${s.startingPrice}</td>
                ))}
              </tr>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">Rating</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {s.rating}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">Duration</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white">{s.duration}</td>
                ))}
              </tr>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">Availability</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white">{s.available}</td>
                ))}
              </tr>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">Features</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white">
                    <ul className="text-sm space-y-1">
                      {s.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-500 dark:text-gray-400">SLA</td>
                {services.map((s) => (
                  <td key={s.id} className="p-3 dark:text-white text-sm">{s.sla}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Services Component
const Services = () => {
  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("name");
  const [suggestions, setSuggestions] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);

  // Parallax effect
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const parallaxOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Services data
  const services = useMemo(
    () => [
      {
        id: "1",
        title: "Book Appointment",
        description: "Schedule consultations with our top specialists for personalized medical care.",
        icon: <CalendarDays className="h-8 w-8 text-green-700" />,
        badge: "Popular",
        available: "Mon - Sat",
        rating: 4.9,
        price: "Free",
        startingPrice: 0,
        category: "Appointments",
        stats: "15,000+ appointments booked",
        duration: "30-60 mins",
        deliverables: ["Consultation", "Prescription", "Follow-up"],
        skillStack: ["Telemedicine", "Patient Care", "Medical Diagnosis"],
        specialBadge: "Most Trusted",
        features: ["Video Call", "Chat Support", "Emergency Access"],
        useCases: ["Routine Checkup", "Specialist Consultation", "Second Opinion"],
        timeline: "Immediate booking, same-day slots available",
        faq: [
          { q: "How long does an appointment take?", a: "30-60 minutes depending on the specialist." },
          { q: "Can I reschedule?", a: "Yes, up to 24 hours before." }
        ],
        portfolio: ["Patient A recovered in 2 weeks", "Patient B improved health metrics"],
        reviews: [
          { name: "John D.", rating: 5, comment: "Excellent service! The doctor was very thorough." },
          { name: "Sarah M.", rating: 5, comment: "Very professional and caring staff." }
        ],
        pricingBreakdown: [{ plan: "Basic", price: 0 }, { plan: "Premium", price: 50 }],
        techStack: ["React", "Node.js", "WebRTC"],
        testimonials: [{ text: "Life-changing experience!", author: "Patient X", video: null }],
        caseStudies: ["Improved patient outcomes by 40%"],
        clientLogos: ["Hospital A", "Clinic B"],
        certifications: ["JCI Accredited", "HIPAA Compliant"],
        sla: "99.9% uptime guarantee",
        beforeAfter: { before: "Long wait times", after: "Instant scheduling" }
      },
      {
        id: "2",
        title: "Online Lab Reports",
        description: "Access your test results securely from anywhere with encrypted digital reports.",
        icon: <FlaskConical className="h-8 w-8 text-green-700" />,
        badge: "New",
        available: "24/7",
        rating: 4.8,
        price: "Included",
        startingPrice: 0,
        category: "Reports",
        stats: "25,000+ reports delivered",
        duration: "Instant",
        deliverables: ["Digital Report", "Interpretation", "Historical Data"],
        skillStack: ["Data Security", "Medical Analysis", "Digital Health"],
        specialBadge: "Secure & Fast",
        features: ["Encrypted Access", "Download PDF", "Share with Doctor"],
        useCases: ["Post-Test Review", "Health Monitoring", "Insurance Claims"],
        timeline: "Results available within 24 hours",
        faq: [
          { q: "How secure are my reports?", a: "End-to-end encrypted with 256-bit encryption." },
          { q: "Can I share reports?", a: "Yes, with authorized healthcare personnel." }
        ],
        portfolio: ["Integrated with 50+ labs", "Processed 100K+ tests"],
        reviews: [
          { name: "Mike R.", rating: 5, comment: "Quick and secure! Got results instantly." },
          { name: "Lisa K.", rating: 4, comment: "Easy to use interface." }
        ],
        pricingBreakdown: [{ plan: "Free", price: 0 }, { plan: "Premium Analysis", price: 25 }],
        techStack: ["Blockchain", "AI Analysis", "Cloud Storage"],
        testimonials: [{ text: "Got my results instantly!", author: "Patient Y", video: null }],
        caseStudies: ["Reduced wait times by 80%"],
        clientLogos: ["Lab Corp", "Quest Diagnostics"],
        certifications: ["ISO 27001", "GDPR Compliant"],
        sla: "24/7 support with 1-hour response",
        beforeAfter: { before: "Paper reports", after: "Instant digital access" }
      },
      {
        id: "3",
        title: "Billing & Payments",
        description: "Pay bills online securely with multiple payment options and review invoices.",
        icon: <CreditCard className="h-8 w-8 text-green-700" />,
        badge: null,
        available: "24/7",
        rating: 4.6,
        price: "As per usage",
        startingPrice: 10,
        category: "Billing",
        stats: "98% secure transactions",
        duration: "Instant",
        deliverables: ["Invoice Generation", "Payment Processing", "Receipt"],
        skillStack: ["Payment Security", "Financial Management", "Compliance"],
        specialBadge: "Secure Payments",
        features: ["Multiple Payment Methods", "Auto-reminders", "Tax Invoices"],
        useCases: ["Bill Payment", "Insurance Claims", "Expense Tracking"],
        timeline: "Immediate processing",
        faq: [
          { q: "What payment methods?", a: "Credit card, bank transfer, digital wallets." },
          { q: "Are payments secure?", a: "Yes, PCI DSS compliant with fraud protection." }
        ],
        portfolio: ["Processed $10M+ in payments", "Integrated with major banks"],
        reviews: [
          { name: "Tom H.", rating: 4, comment: "Convenient billing system." },
          { name: "Anna P.", rating: 5, comment: "Secure and fast processing." }
        ],
        pricingBreakdown: [{ plan: "Basic", price: 0 }, { plan: "Enterprise", price: 100 }],
        techStack: ["Stripe API", "Encryption", "Audit Logs"],
        testimonials: [{ text: "Never had issues with payments!", author: "Patient Z", video: null }],
        caseStudies: ["Reduced payment errors by 95%"],
        clientLogos: ["Visa", "Mastercard"],
        certifications: ["PCI DSS", "SOC 2"],
        sla: "99.99% uptime",
        beforeAfter: { before: "Manual payments", after: "One-click checkout" }
      },
      {
        id: "4",
        title: "Home Health Services",
        description: "Receive lab tests, nursing care & medical attention at your doorstep.",
        icon: <Home className="h-8 w-8 text-green-700" />,
        badge: "Featured",
        available: "Weekends Only",
        rating: 4.7,
        price: "$25/session",
        startingPrice: 25,
        category: "Home Care",
        stats: "1,500+ home visits completed",
        duration: "1-2 hours",
        deliverables: ["Nursing Care", "Lab Tests", "Medication"],
        skillStack: ["Home Nursing", "Patient Monitoring", "Emergency Response"],
        specialBadge: "Comfort at Home",
        features: ["Skilled Nurses", "Mobile Lab", "24/7 Support"],
        useCases: ["Post-Surgery Care", "Chronic Disease Management", "Elderly Care"],
        timeline: "Scheduled within 24 hours",
        faq: [
          { q: "What's included?", a: "Nursing, tests, and medication management." },
          { q: "How to schedule?", a: "Call or book online for next available slot." }
        ],
        portfolio: ["Cared for 500+ patients", "95% satisfaction rate"],
        reviews: [
          { name: "Robert L.", rating: 5, comment: "Excellent home care service!" },
          { name: "Emma W.", rating: 5, comment: "Very caring and professional staff." }
        ],
        pricingBreakdown: [{ plan: "Basic Visit", price: 25 }, { plan: "Extended Care", price: 75 }],
        techStack: ["IoT Devices", "Mobile App", "GPS Tracking"],
        testimonials: [{ text: "Felt like family care!", author: "Patient W", video: null }],
        caseStudies: ["Improved recovery times by 30%"],
        clientLogos: ["Home Health Inc", "CarePlus"],
        certifications: ["Joint Commission", "State Licensed"],
        sla: "Guaranteed response within 2 hours",
        beforeAfter: { before: "Hospital visits", after: "Care at home" }
      },
      {
        id: "5",
        title: "Telemedicine Consultation",
        description: "Connect with doctors remotely for expert medical advice anytime, anywhere.",
        icon: <Video className="h-8 w-8 text-blue-700" />,
        badge: "Trending",
        available: "24/7",
        rating: 4.8,
        price: "$15/session",
        startingPrice: 15,
        category: "Telemedicine",
        stats: "50,000+ consultations",
        duration: "15-30 mins",
        deliverables: ["Video Consultation", "Prescription", "Follow-up Plan"],
        skillStack: ["Telemedicine", "Remote Diagnosis", "Digital Health"],
        specialBadge: "Always Available",
        features: ["HD Video", "Secure Chat", "E-Prescription"],
        useCases: ["Minor Illness", "Follow-up", "Mental Health"],
        timeline: "Available in 5 minutes",
        faq: [
          { q: "Do I need special equipment?", a: "Just a smartphone or computer with camera." },
          { q: "Is it covered by insurance?", a: "Depends on your insurance plan." }
        ],
        portfolio: ["Connected 10K+ patients", "Reduced ER visits by 40%"],
        reviews: [
          { name: "David S.", rating: 5, comment: "Convenient and effective!" },
          { name: "Maria G.", rating: 4, comment: "Great doctors, easy platform." }
        ],
        pricingBreakdown: [{ plan: "Standard", price: 15 }, { plan: "Priority", price: 30 }],
        techStack: ["WebRTC", "AI Triage", "EHR Integration"],
        testimonials: [{ text: "Saved me a trip to the hospital!", author: "Patient V", video: null }],
        caseStudies: ["Improved access in rural areas by 60%"],
        clientLogos: ["Teladoc", "Amwell"],
        certifications: ["HIPAA", "HITECH"],
        sla: "5-minute average wait time",
        beforeAfter: { before: "Drive to clinic", after: "Doctor on your phone" }
      },
      {
        id: "6",
        title: "Mental Health Support",
        description: "Professional counseling and therapy services with licensed therapists.",
        icon: <Heart className="h-8 w-8 text-purple-700" />,
        badge: "Essential",
        available: "Mon - Fri",
        rating: 4.9,
        price: "$20/session",
        startingPrice: 20,
        category: "Mental Health",
        stats: "8,000+ sessions completed",
        duration: "45 mins",
        deliverables: ["Therapy Session", "Coping Strategies", "Progress Tracking"],
        skillStack: ["Psychology", "Counseling", "Mental Health"],
        specialBadge: "Compassionate Care",
        features: ["Licensed Therapists", "Confidential", "Flexible Scheduling"],
        useCases: ["Anxiety", "Depression", "Stress Management"],
        timeline: "Book within a week",
        faq: [
          { q: "Is it confidential?", a: "Absolutely, HIPAA protected and private." },
          { q: "What therapies offered?", a: "CBT, DBT, mindfulness, and more." }
        ],
        portfolio: ["Helped 2K+ patients", "90% reported improvement"],
        reviews: [
          { name: "Chris B.", rating: 5, comment: "Life-changing support!" },
          { name: "Nina T.", rating: 5, comment: "Empathetic and skilled therapists." }
        ],
        pricingBreakdown: [{ plan: "Individual", price: 20 }, { plan: "Couples", price: 35 }],
        techStack: ["Secure Platform", "Progress Analytics", "AI Matching"],
        testimonials: [{ text: "Found my peace again!", author: "Patient U", video: null }],
        caseStudies: ["Reduced anxiety symptoms by 60%"],
        clientLogos: ["Psychology Today", "BetterHelp"],
        certifications: ["APA Approved", "State Licensed"],
        sla: "Guaranteed privacy and confidentiality",
        beforeAfter: { before: "Struggling alone", after: "Professional support" }
      }
    ],
    []
  );

  // Toggle theme
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Apply dark mode and font size
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShownExitPopup) {
        setShowExitPopup(true);
        setHasShownExitPopup(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExitPopup]);

  // Smart suggestions
  useEffect(() => {
    if (search.length > 0) {
      const matches = services
        .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
        .map((s) => s.title);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [search, services]);

  // Filter + Search + Sort
  const filteredServices = useMemo(() => {
    let filtered = services.filter(
      (s) =>
        (filter === "All" || s.category === filter) &&
        s.title.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sort) {
        case "price":
          return a.startingPrice - b.startingPrice;
        case "rating":
          return b.rating - a.rating;
        case "popularity":
          return b.stats.localeCompare(a.stats);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [services, filter, search, sort]);

  // Actions
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    addNotification("Favorites updated!", "success");
  };

  const handleCompare = (service) => {
    if (compare.find((c) => c.id === service.id)) {
      setCompare(compare.filter((c) => c.id !== service.id));
    } else if (compare.length < 2) {
      setCompare([...compare, service]);
      if (compare.length === 1) {
        addNotification("Ready to compare! Click Compare button.", "info");
      }
    } else {
      addNotification("Can only compare 2 services at a time", "warning");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleQuizResult = (category) => {
    setFilter(category);
    addNotification(`Showing ${category} services based on your preferences!`, "success");
  };

  return (
    <div
      className={`min-h-screen transition-all ${
        highContrast 
          ? "bg-black text-white" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      }`}
    >
      {/* Floating Shapes Background */}
      <FloatingShapes />

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <section className="relative min-h-screen py-16 overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: parallaxY, opacity: parallaxOpacity }}
          className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50 dark:from-green-900/20 dark:to-blue-900/20"
        />

        {/* Gradient Wave */}
        <GradientWave />

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          <motion.button
            onClick={toggleTheme}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </motion.button>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-6">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Sparkles className="w-4 h-4" />
                Trusted by 50,000+ patients
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Premium Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Services</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience world-class healthcare with our comprehensive range of services designed for your wellbeing
              </p>
            </div>
          </ScrollReveal>

          {/* Statistics */}
          <StatisticsSection />

          {/* Search + Filter + Sort */}
          <ScrollReveal>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="relative w-full lg:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    aria-label="Search services"
                  />
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl z-10 mt-2 overflow-hidden"
                    >
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearch(suggestion);
                            setSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 border rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-green-500 transition"
                    aria-label="Filter by category"
                  >
                    <option value="All">All Categories</option>
                    <option value="Appointments">Appointments</option>
                    <option value="Reports">Reports</option>
                    <option value="Billing">Billing</option>
                    <option value="Home Care">Home Care</option>
                    <option value="Telemedicine">Telemedicine</option>
                    <option value="Mental Health">Mental Health</option>
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-4 py-3 border rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-green-500 transition"
                    aria-label="Sort services"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="popularity">Sort by Popularity</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <GlowButton variant="secondary" onClick={() => setShowQuiz(true)}>
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Find Service
                    </span>
                  </GlowButton>
                  {compare.length === 2 && (
                    <GlowButton onClick={() => setShowCompare(true)}>
                      <span className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        Compare ({compare.length})
                      </span>
                    </GlowButton>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {filteredServices.map((service, idx) => (
              <ScrollReveal key={service.id} delay={idx * 0.05}>
                <motion.article
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 relative overflow-hidden"
                  whileHover={{ y: -5 }}
                  role="article"
                  aria-labelledby={`service-title-${service.id}`}
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Floating animation elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {service.icon}
                        </motion.div>
                        {service.specialBadge && (
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-2 py-1 rounded-full">
                            {service.specialBadge}
                          </span>
                        )}
                      </div>
                      {service.badge && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 font-semibold px-2 py-1 rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h3 
                      id={`service-title-${service.id}`}
                      className="text-lg font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
                    >
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{service.rating}</span>
                        </span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {service.startingPrice === 0 ? "Free" : `From $${service.startingPrice}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration}
                        </span>
                        <span>{service.stats}</span>
                      </div>
                    </div>

                    {/* Deliverables preview */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.deliverables.slice(0, 2).map((item, i) => (
                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                        {service.deliverables.length > 2 && (
                          <span className="text-xs text-gray-500">+{service.deliverables.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="text-sm text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline transition-colors font-medium"
                          aria-label={`View details for ${service.title}`}
                        >
                          View Details →
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleFavorite(service.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label={favorites.includes(service.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart
                              className={`h-4 w-4 transition-colors ${
                                favorites.includes(service.id)
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-400 hover:text-red-400"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleCompare(service)}
                            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                              compare.find((c) => c.id === service.id) ? "bg-blue-100 dark:bg-blue-900/30" : ""
                            }`}
                            aria-label="Add to comparison"
                          >
                            <Filter className="h-4 w-4 text-blue-500" />
                          </button>
                        </div>
                      </div>

                      <GlowButton className="w-full text-sm py-2">
                        Book Now
                      </GlowButton>
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>

          {/* Workflow Timeline */}
          <WorkflowTimeline />

          {/* Testimonials */}
          <TestimonialsSection />

          {/* Client Logos */}
          <ClientLogos />

          {/* Pricing */}
          <PricingSection onCalculatorOpen={() => setShowCalculator(true)} />

          {/* Trust Section */}
          <TrustSection />

          {/* Newsletter */}
          <NewsletterSection />
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8"
            onClick={() => setSelectedService(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow">
                      {selectedService.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedService.title}</h2>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {selectedService.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedService.stats}
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {selectedService.startingPrice === 0 ? "Free" : `From $${selectedService.startingPrice}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
                {/* Sidebar */}
                <div className="lg:w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Overview</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedService.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Key Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span>{selectedService.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Available:</span>
                          <span>{selectedService.available}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Timeline:</span>
                          <span className="text-right">{selectedService.timeline}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">What's Included</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.deliverables.map((item, i) => (
                          <span key={i} className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.certifications.map((cert, i) => (
                          <span key={i} className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-4">
                      <GlowButton className="w-full">
                        Book Now - {selectedService.startingPrice === 0 ? "Free" : `$${selectedService.startingPrice}`}
                      </GlowButton>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                          <Video className="w-4 h-4" />
                          Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3 p-6 overflow-y-auto">
                  <div className="space-y-8">
                    {/* Before/After */}
                    {selectedService.beforeAfter && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Before</p>
                            <p className="text-sm">{selectedService.beforeAfter.before}</p>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">After</p>
                            <p className="text-sm">{selectedService.beforeAfter.after}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Features & Benefits</h3>
                      <div className="grid gap-3">
                        {selectedService.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Perfect For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.useCases.map((useCase, i) => (
                          <span key={i} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
                      <div className="space-y-4">
                        {selectedService.reviews.map((review, i) => (
                          <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                  {review.name[0]}
                                </div>
                                <span className="font-medium">{review.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">"{review.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQ */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">FAQ</h3>
                      <div className="space-y-3">
                        {selectedService.faq.map((item, i) => (
                          <details key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl group">
                            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center justify-between rounded-xl">
                              {item.q}
                              <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                              {item.a}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>

                    {/* SLA */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Service Guarantee</h3>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700 flex items-center gap-4">
                        <Shield className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-medium">{selectedService.sla}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">30-day money-back guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compare.length === 2 && (
          <CompareModal services={compare} onClose={() => setShowCompare(false)} />
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <ServiceQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} onResult={handleQuizResult} />

      {/* Calculator Modal */}
      <PricingCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-20 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Floating Chat */}
      <FloatingChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setShowExitPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 max-w-md text-center text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Gift className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Wait! Don't Go!</h3>
              <p className="text-white/90 mb-6">
                Get 20% off your first consultation with code: <span className="font-bold">HEALTH20</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitPopup(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition"
                >
                  No Thanks
                </button>
                <button
                  onClick={() => setShowExitPopup(false)}
                  className="flex-1 bg-white text-green-600 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Claim Offer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;