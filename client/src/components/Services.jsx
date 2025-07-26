import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  FlaskConical,
  CreditCard,
  Home,
  Star,
  Sun,
  Moon,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { v4 as uuid } from "uuid";
import doctorImage from "./doctor-patient.jpg";
import "react-tooltip/dist/react-tooltip.css";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sample dynamic data using useMemo for performance
  const services = useMemo(() => [
    {
      id: uuid(),
      title: "Book Appointment",
      description: "Schedule consultations with our top specialists.",
      icon: <CalendarDays className="h-8 w-8 text-green-700" />,
      badge: "Popular",
      available: "Mon - Sat",
      rating: 4.9,
      price: "Free",
      category: "Appointments",
    },
    {
      id: uuid(),
      title: "Online Lab Reports",
      description: "Access your test results securely from anywhere.",
      icon: <FlaskConical className="h-8 w-8 text-green-700" />,
      badge: "New",
      available: "24/7",
      rating: 4.8,
      price: "Included",
      category: "Reports",
    },
    {
      id: uuid(),
      title: "Billing & Payments",
      description: "Pay bills online securely and review your invoices.",
      icon: <CreditCard className="h-8 w-8 text-green-700" />,
      badge: null,
      available: "24/7",
      rating: 4.6,
      price: "As per usage",
      category: "Billing",
    },
    {
      id: uuid(),
      title: "Home Health Services",
      description: "Receive lab tests, nursing & care at your doorstep.",
      icon: <Home className="h-8 w-8 text-green-700" />,
      badge: "Featured",
      available: "Weekends Only",
      rating: 4.7,
      price: "$25/session",
      category: "Home Care",
    },
  ], []);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCardClick = (service) => {
    console.log(`Service Clicked: ${service.title}`); // analytics placeholder
    setSelectedService(service);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <section
        className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat py-16 dark:bg-gray-900 transition"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.6)), url(${doctorImage})`,
        }}
        aria-label="Core Services Section"
      >
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/70 p-6 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
            Our Core Services
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="group bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-transparent hover:border-green-500 transition cursor-pointer relative"
                role="button"
                tabIndex={0}
                aria-describedby={`desc-${service.id}`}
                onClick={() => handleCardClick(service)}
                data-tooltip-id={`tooltip-${service.id}`}
                data-tooltip-content="Click for more details"
              >
                <div className="flex justify-between items-center mb-4">
                  {service.icon}
                  {service.badge && (
                    <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm" id={`desc-${service.id}`}>
                  {service.description}
                </p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                  <span>
                    <Star className="inline h-4 w-4 text-yellow-500" /> {service.rating} Rating
                  </span>
                  <span>Available: {service.available}</span>
                  <span>Price: {service.price}</span>
                  <span>Category: {service.category}</span>
                </div>
                <Tooltip id={`tooltip-${service.id}`} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setSelectedService(null)}
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 rounded-lg w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2">{selectedService.title}</h3>
              <p className="mb-4">{selectedService.description}</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Availability: {selectedService.available}</li>
                <li>Rating: {selectedService.rating}</li>
                <li>Price: {selectedService.price}</li>
                <li>Category: {selectedService.category}</li>
              </ul>
              <button
                onClick={() => setSelectedService(null)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;
