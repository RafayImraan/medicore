import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaMinus, FaTrash, FaShoppingCart, FaMoon, FaSun } from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const generateFakeMedicines = (count = 20) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: parseFloat(faker.commerce.price()),
    quantity: faker.number.int({ min: 10, max: 100 }),
    expiry: faker.date.soon({ days: 300 }),
    supplier: faker.company.name(),
  }));
};

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState(generateFakeMedicines());
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const addToCart = (med) => {
    const exists = cart.find((m) => m.id === med.id);
    if (exists) {
      setCart(cart.map((m) => (m.id === med.id ? { ...m, qty: m.qty + 1 } : m)));
    } else {
      setCart([...cart, { ...med, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((m) => m.id !== id));
  };

  const updateQuantity = (id, type) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + (type === "inc" ? 1 : -1)) }
          : item
      )
    );
  };

  const total = cart.reduce((sum, m) => sum + m.price * m.qty, 0);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById("invoice");
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10);
      doc.save("invoice.pdf");
    });
  };

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="text-2xl p-2 border rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center border p-2 rounded w-full">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaShoppingCart className="text-3xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {cart.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((med) => (
          <div key={med.id} className="border rounded-xl p-4 shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-1">{med.name}</h2>
            <p className="text-sm text-gray-500">Category: {med.category}</p>
            <p className="text-sm">Supplier: {med.supplier}</p>
            <p className="text-sm">Expiry: {format(new Date(med.expiry), "PPP")}</p>
            <p className="text-sm">Price: ${med.price.toFixed(2)}</p>
            <p className="text-sm">Stock: {med.quantity}</p>
            <button
              onClick={() => addToCart(med)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg" id="invoice">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <div>
                  {item.name} x {item.qty} = ${(item.qty * item.price).toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, "dec")}
                    className="bg-yellow-400 px-2 rounded"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, "inc")}
                    className="bg-green-400 px-2 rounded"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <p className="text-right font-semibold mt-4">Total: ${total.toFixed(2)}</p>
          </div>
          <button
            onClick={generatePDF}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Invoice (PDF)
          </button>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
