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
  Heart,
  Filter,
  BarChart2,
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
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [compare, setCompare] = useState([]);

  // Services data
  const services = useMemo(
    () => [
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
        stats: "15,000+ appointments booked",
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
        stats: "25,000+ reports delivered",
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
        stats: "98% secure transactions",
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
        stats: "1,500+ home visits completed",
      },
    ],
    []
  );

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCardClick = (service) => setSelectedService(service);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleCompare = (service) => {
    if (compare.find((c) => c.id === service.id)) {
      setCompare(compare.filter((c) => c.id !== service.id));
    } else if (compare.length < 2) {
      setCompare([...compare, service]);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Filter + Search
  const filteredServices = services.filter(
    (s) =>
      (filter === "All" || s.category === filter) &&
      s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section
        className="relative min-h-[100vh] bg-cover bg-center bg-no-repeat py-16 dark:bg-gray-900 transition"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.7)), url(${doctorImage})`,
        }}
      >
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 py-8 rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/70 shadow-lg">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Our Core Services
          </h2>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2 p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            >
              <option value="All">All</option>
              <option value="Appointments">Appointments</option>
              <option value="Reports">Reports</option>
              <option value="Billing">Billing</option>
              <option value="Home Care">Home Care</option>
            </select>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredServices.map((service, idx) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="group bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-green-500 transition relative"
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
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {service.description}
                </p>
                <div className="mt-2 text-sm flex flex-col gap-1">
                  <span>
                    <Star className="inline h-4 w-4 text-yellow-500" /> {service.rating}
                  </span>
                  <span>Available: {service.available}</span>
                  <span>Price: {service.price}</span>
                  <span>{service.stats}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleCardClick(service)}
                    className="text-sm text-green-700 hover:underline"
                  >
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => toggleFavorite(service.id)}>
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(service.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <button onClick={() => handleCompare(service)}>
                      <Filter className="h-5 w-5 text-blue-500" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setSelectedService(null)}
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
                <li>{selectedService.stats}</li>
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

      {/* Compare Drawer */}
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 p-4 shadow-xl z-50"
          >
            <h3 className="text-xl font-bold mb-4">Compare Services</h3>
            {compare.map((s) => (
              <div key={s.id} className="mb-3 border-b pb-2">
                <h4 className="font-semibold">{s.title}</h4>
                <p className="text-sm">{s.description}</p>
              </div>
            ))}
            <button
              onClick={() => setCompare([])}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;
