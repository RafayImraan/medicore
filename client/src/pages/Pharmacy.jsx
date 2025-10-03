import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaMinus, FaTrash, FaShoppingCart, FaMoon, FaSun, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Toast from '../components/Toast';

const generatePharmacyItems = () => {
  const pharmacyItems = [
    // OTC Medicines & Relief Items
    { name: "Paracetamol 500mg", category: "Pain Relief", price: 2.50, type: "Tablet" },
    { name: "Ibuprofen 400mg", category: "Pain Relief", price: 3.00, type: "Tablet" },
    { name: "Aspirin 75mg", category: "Cardiovascular", price: 1.50, type: "Tablet" },
    { name: "Naproxen 250mg", category: "Pain Relief", price: 4.00, type: "Tablet" },
    { name: "Loratadine 10mg", category: "Allergy", price: 3.50, type: "Tablet" },
    { name: "Cetirizine 10mg", category: "Allergy", price: 2.50, type: "Tablet" },
    { name: "Fexofenadine 180mg", category: "Allergy", price: 5.00, type: "Tablet" },
    { name: "Antacid Tablets", category: "Digestive", price: 2.00, type: "Tablet" },
    { name: "Laxatives", category: "Digestive", price: 3.50, type: "Tablet" },
    { name: "ORS Solution", category: "Digestive", price: 1.50, type: "Powder" },
    { name: "Anti-diarrheal Tablets", category: "Digestive", price: 2.50, type: "Tablet" },
    { name: "Motion Sickness Pills", category: "Travel Health", price: 3.00, type: "Tablet" },

    // Prescription Medicines
    { name: "Amoxicillin 500mg", category: "Antibiotic", price: 5.00, type: "Capsule" },
    { name: "Azithromycin 500mg", category: "Antibiotic", price: 8.00, type: "Tablet" },
    { name: "Ciprofloxacin 500mg", category: "Antibiotic", price: 4.50, type: "Tablet" },
    { name: "Omeprazole 20mg", category: "Digestive", price: 3.50, type: "Capsule" },
    { name: "Metformin 500mg", category: "Diabetes", price: 2.00, type: "Tablet" },
    { name: "Glimepiride 2mg", category: "Diabetes", price: 3.50, type: "Tablet" },
    { name: "Amlodipine 5mg", category: "Cardiovascular", price: 2.50, type: "Tablet" },
    { name: "Losartan 50mg", category: "Cardiovascular", price: 3.00, type: "Tablet" },
    { name: "Atorvastatin 10mg", category: "Cholesterol", price: 4.00, type: "Tablet" },
    { name: "Salbutamol Inhaler", category: "Respiratory", price: 12.00, type: "Inhaler" },
    { name: "Insulin Injection (100IU/ml)", category: "Diabetes", price: 15.00, type: "Injection" },
    { name: "Antibiotic Injection", category: "Antibiotic", price: 20.00, type: "Injection" },

    // Syrups & Liquids
    { name: "Cough Syrup (Dextromethorphan)", category: "Cough & Cold", price: 6.00, type: "Syrup" },
    { name: "Antihistamine Syrup", category: "Allergy", price: 5.50, type: "Syrup" },
    { name: "Vitamin C Syrup", category: "Vitamins", price: 7.00, type: "Syrup" },
    { name: "Iron Tonic Syrup", category: "Supplements", price: 8.00, type: "Syrup" },
    { name: "Cough Syrup for Children", category: "Cough & Cold", price: 4.50, type: "Syrup" },
    { name: "Nasal Spray", category: "Respiratory", price: 5.00, type: "Spray" },

    // Vitamins & Supplements
    { name: "Multivitamin Tablets", category: "Vitamins", price: 6.00, type: "Tablet" },
    { name: "Vitamin D3 Capsules", category: "Vitamins", price: 5.50, type: "Capsule" },
    { name: "Vitamin C Tablets", category: "Vitamins", price: 4.00, type: "Tablet" },
    { name: "Calcium Tablets", category: "Vitamins", price: 4.50, type: "Tablet" },
    { name: "Iron Supplements", category: "Supplements", price: 3.50, type: "Tablet" },
    { name: "Omega-3 Capsules", category: "Supplements", price: 7.50, type: "Capsule" },
    { name: "Fish Oil Capsules", category: "Supplements", price: 8.00, type: "Capsule" },
    { name: "Collagen Supplements", category: "Supplements", price: 12.00, type: "Powder" },
    { name: "Biotin Tablets", category: "Supplements", price: 6.50, type: "Tablet" },
    { name: "Protein Powder", category: "Supplements", price: 25.00, type: "Powder" },
    { name: "Infant Vitamins", category: "Baby Care", price: 8.00, type: "Drops" },

    // Personal & Lifestyle Products
    { name: "Condoms (Pack of 12)", category: "Family Planning", price: 3.50, type: "Condom" },
    { name: "Flavored Condoms", category: "Family Planning", price: 4.50, type: "Condom" },
    { name: "Extra Safe Condoms", category: "Family Planning", price: 5.00, type: "Condom" },
    { name: "Water-based Lubricant", category: "Family Planning", price: 6.00, type: "Gel" },
    { name: "Silicone-based Lubricant", category: "Family Planning", price: 7.50, type: "Gel" },
    { name: "Pregnancy Test Kit", category: "Family Planning", price: 5.00, type: "Test Kit" },
    { name: "Ovulation Kit", category: "Family Planning", price: 8.00, type: "Test Kit" },
    { name: "Contraceptive Pills", category: "Family Planning", price: 8.00, type: "Tablet" },
    { name: "Emergency Contraceptive", category: "Family Planning", price: 12.00, type: "Tablet" },
    { name: "Sanitary Napkins", category: "Feminine Care", price: 4.00, type: "Napkins" },
    { name: "Tampons", category: "Feminine Care", price: 5.50, type: "Tampons" },
    { name: "Menstrual Cup", category: "Feminine Care", price: 15.00, type: "Cup" },
    { name: "Adult Diapers", category: "Personal Care", price: 18.00, type: "Diaper" },
    { name: "Incontinence Pads", category: "Personal Care", price: 12.00, type: "Pads" },

    // First Aid & Health Devices
    { name: "Bandages (Pack of 20)", category: "First Aid", price: 2.00, type: "Bandage" },
    { name: "Antiseptic Cream", category: "First Aid", price: 3.50, type: "Cream" },
    { name: "Plasters (Assorted)", category: "First Aid", price: 1.50, type: "Plaster" },
    { name: "Burn Cream", category: "First Aid", price: 4.00, type: "Cream" },
    { name: "Antifungal Cream", category: "First Aid", price: 4.50, type: "Cream" },
    { name: "Anti-itch Cream", category: "First Aid", price: 3.00, type: "Cream" },
    { name: "Cotton Balls", category: "First Aid", price: 1.00, type: "Cotton" },
    { name: "Cotton Swabs", category: "First Aid", price: 1.50, type: "Swabs" },
    { name: "Gauze", category: "First Aid", price: 2.50, type: "Gauze" },
    { name: "Hand Sanitizer", category: "First Aid", price: 3.00, type: "Gel" },
    { name: "Antiseptic Wipes", category: "First Aid", price: 4.00, type: "Wipes" },
    { name: "Digital Thermometer", category: "Medical Equipment", price: 8.00, type: "Thermometer" },
    { name: "Blood Pressure Monitor", category: "Medical Equipment", price: 35.00, type: "Monitor" },
    { name: "Glucometer Strips", category: "Medical Equipment", price: 15.00, type: "Strips" },
    { name: "Nebulizer", category: "Medical Equipment", price: 45.00, type: "Nebulizer" },
    { name: "Face Masks (Pack of 50)", category: "Medical Equipment", price: 8.00, type: "Masks" },
    { name: "Medical Gloves", category: "Medical Equipment", price: 5.00, type: "Gloves" },
    { name: "Wheelchair", category: "Medical Equipment", price: 150.00, type: "Wheelchair" },
    { name: "Crutches", category: "Medical Equipment", price: 25.00, type: "Crutches" },
    { name: "Compression Stockings", category: "Medical Equipment", price: 18.00, type: "Stockings" },

    // Baby & Childcare
    { name: "Baby Diapers (Pack of 30)", category: "Baby Care", price: 12.00, type: "Diaper" },
    { name: "Baby Wipes", category: "Baby Care", price: 3.00, type: "Wipes" },
    { name: "Baby Lotion", category: "Baby Care", price: 5.00, type: "Lotion" },
    { name: "Infant Formula", category: "Baby Care", price: 25.00, type: "Formula" },
    { name: "Baby Cereal", category: "Baby Care", price: 8.00, type: "Cereal" },
    { name: "Feeding Bottles", category: "Baby Care", price: 6.00, type: "Bottle" },
    { name: "Pacifiers", category: "Baby Care", price: 3.50, type: "Pacifier" },
    { name: "Rash Cream", category: "Baby Care", price: 4.50, type: "Cream" },

    // Personal Care & Hygiene
    { name: "Toothpaste", category: "Oral Care", price: 2.50, type: "Toothpaste" },
    { name: "Mouthwash", category: "Oral Care", price: 4.00, type: "Mouthwash" },
    { name: "Dental Floss", category: "Oral Care", price: 3.00, type: "Floss" },
    { name: "Toothbrushes", category: "Oral Care", price: 2.00, type: "Brush" },
    { name: "Shampoo", category: "Hair Care", price: 4.00, type: "Shampoo" },
    { name: "Anti-dandruff Shampoo", category: "Hair Care", price: 5.50, type: "Shampoo" },
    { name: "Hair Oil", category: "Hair Care", price: 6.00, type: "Oil" },
    { name: "Hair Regrowth Tonic", category: "Hair Care", price: 12.00, type: "Tonic" },
    { name: "Soap Bars (Pack of 4)", category: "Skin Care", price: 3.00, type: "Soap" },
    { name: "Moisturizer", category: "Skin Care", price: 8.00, type: "Cream" },
    { name: "Sunscreen", category: "Skin Care", price: 10.00, type: "Cream" },
    { name: "Acne Cream", category: "Skin Care", price: 6.50, type: "Cream" },
    { name: "Fairness Cream", category: "Skin Care", price: 7.00, type: "Cream" },
    { name: "Deodorant", category: "Personal Care", price: 3.50, type: "Deodorant" },
    { name: "Eye Drops", category: "Eye Care", price: 4.50, type: "Drops" },
    { name: "Throat Lozenges", category: "Throat Care", price: 2.50, type: "Lozenges" },

    // Other Essentials
    { name: "Slimming Tea", category: "Supplements", price: 8.00, type: "Tea" },
    { name: "Detox Drink", category: "Supplements", price: 6.00, type: "Drink" },
    { name: "Meal Replacement Shake", category: "Supplements", price: 15.00, type: "Powder" },
    { name: "Weight Gainer", category: "Supplements", price: 20.00, type: "Powder" },
    { name: "Ayurvedic Medicine", category: "Supplements", price: 12.00, type: "Tablet" },
    { name: "Homeopathic Remedies", category: "Supplements", price: 8.00, type: "Tablets" }
  ];

  return pharmacyItems.map((item, index) => ({
    id: faker.string.uuid(),
    name: item.name,
    category: item.category,
    price: item.price,
    type: item.type,
    quantity: faker.number.int({ min: 10, max: 100 }),
    expiry: faker.date.soon({ days: 300 }),
    supplier: faker.company.name(),
  }));
};

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState(generatePharmacyItems());
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [orderMessage, setOrderMessage] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const { user } = useAuth();

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (med) => {
    try {
      const response = await apiRequest('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          patientId: user?._id,
          medicineId: med.id,
          name: med.name,
          quantity: 1,
          price: med.price,
        }),
      });
      if (response) {
        // Fetch updated cart
        fetchCart();
        showToast("Added successfully");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await apiRequest(`/api/cart/${user?._id}`, {
        method: 'GET',
      });
      if (response) {
        setCart(response.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await apiRequest(`/api/cart/${user?._id}/remove/${id}`, {
        method: 'DELETE',
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (id, type) => {
    try {
      const item = cart.find((item) => item.medicineId === id);
      if (!item) return;
      const newQty = Math.max(1, item.quantity + (type === "inc" ? 1 : -1));
      await apiRequest('/api/cart/update', {
        method: 'PUT',
        body: JSON.stringify({
          patientId: user?._id,
          medicineId: id,
          quantity: newQty,
        }),
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // Filter cart to only show pharmacy items
  const pharmacyCartItems = cart.filter(cartItem =>
    medicines.some(medicine => medicine.id === cartItem.medicineId)
  );

  const total = pharmacyCartItems.reduce((sum, m) => sum + m.price * m.quantity, 0);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
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
    document.documentElement.className = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const placeOrder = async () => {
    setOrderStatus('loading');
    try {
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          patientId: user?._id,
          items: cart,
          totalAmount: total,
        }),
      });
      if (response) {
        setOrderStatus('success');
        setOrderMessage('Order placed successfully');
        // Clear cart after order
        await apiRequest(`/api/cart/${user?._id}/clear`, {
          method: 'DELETE',
        });
        setCart([]);
      } else {
        setOrderStatus('error');
        setOrderMessage('Failed to place order');
      }
    } catch (error) {
      setOrderStatus('error');
      setOrderMessage('Failed to place order');
    }
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pharmacy</h1>
        <button onClick={toggleTheme} className="p-2 rounded bg-gray-300 dark:bg-gray-800">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search medicines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 rounded w-full"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaSearch className="text-blue-600" />
            Pharmacy Items
          </h2>

          {/* Category Filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            {['All', 'Pain Relief', 'Antibiotic', 'Vitamins', 'First Aid', 'Baby Care', 'Personal Care', 'Medical Equipment'].map((category) => (
              <button
                key={category}
                onClick={() => setSearch(category === 'All' ? '' : category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  (search === category || (category === 'All' && !search))
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'Tablet' ? 'bg-green-100 text-green-800' :
                      item.type === 'Capsule' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'Syrup' ? 'bg-purple-100 text-purple-800' :
                      item.type === 'Injection' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.category}</p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Stock: {item.quantity}</span>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-sm" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Cart Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaShoppingCart className="text-blue-600" />
              Shopping Cart ({pharmacyCartItems.length} items)
            </h2>

            {pharmacyCartItems.length === 0 ? (
              <div className="text-center py-8">
                <FaShoppingCart className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add some pharmacy items to get started</p>
              </div>
            ) : (
              <div id="invoice" className="space-y-4">
                {pharmacyCartItems.map((item) => (
                  <div key={item.medicineId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.medicineId, "dec")}
                          className="w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.medicineId, "inc")}
                          className="w-8 h-8 bg-green-400 hover:bg-green-500 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-blue-600">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.medicineId)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Section */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {pharmacyCartItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={generatePDF}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Download Invoice (PDF)
                </button>
                <button
                  onClick={placeOrder}
                  disabled={orderStatus === 'loading'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {orderStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      Place Order
                    </>
                  )}
                </button>
              </div>

              {orderStatus && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                  orderStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  orderStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {orderStatus === 'success' && <FaCheckCircle />}
                  {orderStatus === 'error' && <FaExclamationTriangle />}
                  <span className="font-medium">{orderMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" duration={3000} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default PharmacyDashboard;
