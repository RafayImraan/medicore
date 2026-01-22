import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Fuse from 'fuse.js';
import {
  ShoppingCart, Search, Menu, X, Palette, User, Info, AlertCircle, Clock, Package,
  Plus, Minus, Trash2, Download, Tag, CheckCircle, Building2, AlertTriangle,
  Loader2, XCircle
} from 'lucide-react';

// ==================== TYPES & CONSTANTS ====================

const THEMES = {
  light: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    accent: '#8B5CF6',
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
    accent: '#A78BFA',
  },
  pastel: {
    primary: '#A78BFA',
    secondary: '#F472B6',
    background: '#FEF3C7',
    card: '#FFFBEB',
    text: '#78350F',
    border: '#FDE68A',
    accent: '#FB923C',
  },
  ocean: {
    primary: '#06B6D4',
    secondary: '#14B8A6',
    background: '#ECFEFF',
    card: '#F0FDFA',
    text: '#134E4A',
    border: '#99F6E4',
    accent: '#0EA5E9',
  },
  carbon: {
    primary: '#F59E0B',
    secondary: '#EF4444',
    background: '#18181B',
    card: '#27272A',
    text: '#FAFAFA',
    border: '#3F3F46',
    accent: '#FB923C',
  },
  mint: {
    primary: '#10B981',
    secondary: '#8B5CF6',
    background: '#F0FDF4',
    card: '#DCFCE7',
    text: '#14532D',
    border: '#BBF7D0',
    accent: '#059669',
  },
};

const TYPE_COLORS = {
  Tablet: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Capsule: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Syrup: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Injection: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Cream: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  Drops: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  Inhaler: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  Powder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Spray: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  Gel: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Lotion: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
};

const CATEGORIES = [
  { id: '1', name: 'All', icon: '🏥', color: '#3B82F6' },
  { id: '2', name: 'Pain Relief', icon: '💊', color: '#EF4444' },
  { id: '3', name: 'Antibiotic', icon: '💉', color: '#10B981' },
  { id: '4', name: 'Vitamins', icon: '🌟', color: '#F59E0B' },
  { id: '5', name: 'Digestive', icon: '🫁', color: '#8B5CF6' },
  { id: '6', name: 'Cardiovascular', icon: '❤️', color: '#EC4899' },
  { id: '7', name: 'Respiratory', icon: '🫁', color: '#06B6D4' },
  { id: '8', name: 'Allergy', icon: '🤧', color: '#14B8A6' },
  { id: '9', name: 'Diabetes', icon: '🩺', color: '#F97316' },
  { id: '10', name: 'First Aid', icon: '🩹', color: '#84CC16' },
  { id: '11', name: 'Baby Care', icon: '👶', color: '#A78BFA' },
  { id: '12', name: 'Skin Care', icon: '✨', color: '#FB923C' },
  { id: '13', name: 'Supplements', icon: '💪', color: '#22C55E' },
  { id: '14', name: 'Medical Equipment', icon: '🔬', color: '#6366F1' },
];

// ==================== DATA GENERATION ====================

const generateMedicines = () => {
  const pharmacyItems = [
    { name: "Paracetamol 500mg", category: "Pain Relief", price: 2.50, type: "Tablet" },
    { name: "Ibuprofen 400mg", category: "Pain Relief", price: 3.00, type: "Tablet" },
    { name: "Aspirin 75mg", category: "Cardiovascular", price: 1.50, type: "Tablet" },
    { name: "Naproxen 250mg", category: "Pain Relief", price: 4.00, type: "Tablet" },
    { name: "Loratadine 10mg", category: "Allergy", price: 3.50, type: "Tablet" },
    { name: "Cetirizine 10mg", category: "Allergy", price: 2.50, type: "Tablet" },
    { name: "Fexofenadine 180mg", category: "Allergy", price: 5.00, type: "Tablet" },
    { name: "Antacid Tablets", category: "Digestive", price: 2.00, type: "Tablet" },
    { name: "Omeprazole 20mg", category: "Digestive", price: 3.50, type: "Capsule" },
    { name: "Laxatives", category: "Digestive", price: 3.50, type: "Tablet" },
    { name: "ORS Solution", category: "Digestive", price: 1.50, type: "Powder" },
    { name: "Amoxicillin 500mg", category: "Antibiotic", price: 5.00, type: "Capsule" },
    { name: "Azithromycin 500mg", category: "Antibiotic", price: 8.00, type: "Tablet" },
    { name: "Ciprofloxacin 500mg", category: "Antibiotic", price: 4.50, type: "Tablet" },
    { name: "Metformin 500mg", category: "Diabetes", price: 2.00, type: "Tablet" },
    { name: "Glimepiride 2mg", category: "Diabetes", price: 3.50, type: "Tablet" },
    { name: "Insulin Injection", category: "Diabetes", price: 15.00, type: "Injection" },
    { name: "Amlodipine 5mg", category: "Cardiovascular", price: 2.50, type: "Tablet" },
    { name: "Losartan 50mg", category: "Cardiovascular", price: 3.00, type: "Tablet" },
    { name: "Atorvastatin 10mg", category: "Cardiovascular", price: 4.00, type: "Tablet" },
    { name: "Salbutamol Inhaler", category: "Respiratory", price: 12.00, type: "Inhaler" },
    { name: "Cough Syrup", category: "Respiratory", price: 6.00, type: "Syrup" },
    { name: "Nasal Spray", category: "Respiratory", price: 5.00, type: "Spray" },
    { name: "Multivitamin Tablets", category: "Vitamins", price: 6.00, type: "Tablet" },
    { name: "Vitamin D3 Capsules", category: "Vitamins", price: 5.50, type: "Capsule" },
    { name: "Vitamin C Tablets", category: "Vitamins", price: 4.00, type: "Tablet" },
    { name: "Calcium Tablets", category: "Vitamins", price: 4.50, type: "Tablet" },
    { name: "Iron Supplements", category: "Supplements", price: 3.50, type: "Tablet" },
    { name: "Omega-3 Capsules", category: "Supplements", price: 7.50, type: "Capsule" },
    { name: "Protein Powder", category: "Supplements", price: 25.00, type: "Powder" },
    { name: "Baby Diapers", category: "Baby Care", price: 12.00, type: "Powder" },
    { name: "Baby Lotion", category: "Baby Care", price: 5.00, type: "Lotion" },
    { name: "Rash Cream", category: "Baby Care", price: 4.50, type: "Cream" },
    { name: "Bandages Pack", category: "First Aid", price: 2.00, type: "Gel" },
    { name: "Antiseptic Cream", category: "First Aid", price: 3.50, type: "Cream" },
    { name: "Hand Sanitizer", category: "First Aid", price: 3.00, type: "Gel" },
    { name: "Moisturizer", category: "Skin Care", price: 8.00, type: "Cream" },
    { name: "Sunscreen", category: "Skin Care", price: 10.00, type: "Cream" },
    { name: "Acne Cream", category: "Skin Care", price: 6.50, type: "Cream" },
    { name: "Digital Thermometer", category: "Medical Equipment", price: 8.00, type: "Tablet" },
    { name: "Blood Pressure Monitor", category: "Medical Equipment", price: 35.00, type: "Tablet" },
    { name: "Face Masks Pack", category: "Medical Equipment", price: 8.00, type: "Gel" },
  ];

  return pharmacyItems.map((item) => ({
    id: faker.string.uuid(),
    name: item.name,
    category: item.category,
    price: item.price,
    type: item.type,
    quantity: faker.number.int({ min: 5, max: 150 }),
    expiry: faker.date.future({ years: 2 }),
    supplier: faker.company.name(),
    description: faker.lorem.sentence(),
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/920366/2026-01-20/8880561c-baf1-4391-9570-888e6472e25a.png',
    batchNumber: `BATCH-${faker.string.alphanumeric(8).toUpperCase()}`,
    dosage: `${faker.number.int({ min: 1, max: 3 })} times daily`,
    sideEffects: [faker.lorem.words(3), faker.lorem.words(3), faker.lorem.words(3)],
    interactions: [faker.lorem.words(4), faker.lorem.words(4)],
  }));
};

// ==================== CONTEXTS ====================

const ThemeContext = createContext();
const CartContext = createContext();
const NotificationContext = createContext();

const useTheme = () => useContext(ThemeContext);
const useCart = () => useContext(CartContext);
const useNotification = () => useContext(NotificationContext);

// ==================== HOOKS ====================

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ==================== COMPONENTS ====================

const Toast = ({ id, type, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] backdrop-blur-sm bg-opacity-95`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ notifications, onClose }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>
      {notifications.map((n) => (
        <Toast key={n.id} {...n} onClose={() => onClose(n.id)} />
      ))}
    </AnimatePresence>
  </div>
);

const Navbar = ({ onSearchChange, onCartClick }) => {
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', color: '#3B82F6' },
    { value: 'dark', label: 'Dark', color: '#60A5FA' },
    { value: 'pastel', label: 'Pastel Health', color: '#A78BFA' },
    { value: 'ocean', label: 'Ocean Breeze', color: '#06B6D4' },
    { value: 'carbon', label: 'Carbon', color: '#F59E0B' },
    { value: 'mint', label: 'Mint', color: '#10B981' },
  ];

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-lg bg-[var(--color-card)] bg-opacity-80 border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              Rx
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text)]">MediCare Pharmacy</h1>
              <p className="text-xs text-[var(--color-text)] opacity-60">Your Health, Our Priority</p>
            </div>
          </motion.div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)] opacity-40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder="Search medicines, categories..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowThemeMenu(!showThemeMenu)} className="p-2 rounded-lg hover:bg-[var(--color-background)]">
                <Palette className="w-5 h-5 text-[var(--color-text)]" />
              </button>
              {showThemeMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-[var(--color-background)] flex items-center gap-3 ${theme === t.value ? 'bg-[var(--color-background)]' : ''}`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-[var(--color-text)]">{t.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <button className="p-2 rounded-lg hover:bg-[var(--color-background)]">
              <User className="w-5 h-5 text-[var(--color-text)]" />
            </button>

            <button onClick={onCartClick} className="relative p-2 rounded-lg hover:bg-[var(--color-background)]">
              <ShoppingCart className="w-5 h-5 text-[var(--color-text)]" />
              {itemCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-secondary)] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const CategorySidebar = ({ selectedCategory, onCategorySelect, categoryCounts }) => (
  <div className="bg-[var(--color-card)] rounded-xl shadow-md p-4 border border-[var(--color-border)] sticky top-20">
    <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
      <span>📋</span>Categories
    </h2>
    <div className="space-y-2">
      {CATEGORIES.map((category) => {
        const count = categoryCounts[category.name] || 0;
        const isSelected = selectedCategory === category.name;
        return (
          <motion.button
            key={category.id}
            whileHover={{ x: 4 }}
            onClick={() => onCategorySelect(category.name)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${isSelected ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'hover:bg-[var(--color-background)] text-[var(--color-text)]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${isSelected ? 'bg-white bg-opacity-20' : 'bg-[var(--color-background)]'}`}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  </div>
);

const ProductCard = ({ medicine, onDetailsClick }) => {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);

  const daysUntilExpiry = Math.ceil((new Date(medicine.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isLowStock = medicine.quantity < 20;
  const isExpiringSoon = daysUntilExpiry < 90;

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        image: medicine.image,
        type: medicine.type,
      });
      addNotification('success', `${medicine.name} added to cart!`);
      setIsAdding(false);
    }, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-[var(--color-card)] rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[var(--color-border)]"
    >
      <div className="relative h-48 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] bg-opacity-10 overflow-hidden">
        <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[medicine.type] || 'bg-gray-100 text-gray-800'}`}>
            {medicine.type}
          </span>
          {isLowStock && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />Low Stock
            </span>
          )}
          {isExpiringSoon && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <Clock className="w-3 h-3" />Expiring Soon
            </span>
          )}
        </div>
        <button onClick={() => onDetailsClick(medicine)} className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
          <Info className="w-4 h-4 text-[var(--color-primary)]" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-[var(--color-text)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {medicine.name}
        </h3>
        <p className="text-sm text-[var(--color-text)] opacity-60 mb-3">{medicine.category}</p>
        <div className="flex items-center justify-between mb-3 text-xs text-[var(--color-text)] opacity-70">
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>Stock: {medicine.quantity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{daysUntilExpiry}d</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[var(--color-primary)]">${medicine.price.toFixed(2)}</span>
            <span className="text-xs text-[var(--color-text)] opacity-60 ml-1">/ unit</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding || medicine.quantity === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isAdding || medicine.quantity === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--color-primary)] text-white hover:bg-opacity-90 shadow-lg'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Adding...' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductModal = ({ medicine, onClose }) => {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  if (!medicine) return null;

  const daysUntilExpiry = Math.ceil((new Date(medicine.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleAddToCart = () => {
    addToCart({
      medicineId: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      image: medicine.image,
      type: medicine.type,
    });
    addNotification('success', `${medicine.name} added to cart!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--color-card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--color-border)]">
          <div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-border)] p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Medicine Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--color-background)] rounded-lg">
              <X className="w-6 h-6 text-[var(--color-text)]" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <img src={medicine.image} alt={medicine.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{medicine.name}</h3>
                <p className="text-[var(--color-text)] opacity-60 mb-4">{medicine.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[var(--color-text)]">
                    <Package className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs opacity-60">Stock</p>
                      <p className="font-semibold">{medicine.quantity} units</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text)]">
                    <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs opacity-60">Expiry</p>
                      <p className="font-semibold">{daysUntilExpiry} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text)]">
                    <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs opacity-60">Supplier</p>
                      <p className="font-semibold text-sm">{medicine.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text)]">
                    <Package className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-xs opacity-60">Batch</p>
                      <p className="font-semibold text-sm">{medicine.batchNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg">
                  <div>
                    <p className="text-sm text-[var(--color-text)] opacity-60">Price</p>
                    <p className="text-3xl font-bold text-[var(--color-primary)]">${medicine.price.toFixed(2)}</p>
                  </div>
                  <button onClick={handleAddToCart} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>Dosage
                </h4>
                <p className="text-[var(--color-text)] opacity-70 pl-4">{medicine.dosage}</p>
              </div>
              {medicine.sideEffects?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />Possible Side Effects
                  </h4>
                  <ul className="list-disc list-inside text-[var(--color-text)] opacity-70 pl-4 space-y-1">
                    {medicine.sideEffects.map((effect, i) => <li key={i}>{effect}</li>)}
                  </ul>
                </div>
              )}
              {medicine.interactions?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />Drug Interactions
                  </h4>
                  <ul className="list-disc list-inside text-[var(--color-text)] opacity-70 pl-4 space-y-1">
                    {medicine.interactions.map((interaction, i) => <li key={i}>{interaction}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, updateNotes, clearCart, total, discount, applyPromoCode } = useCart();
  const { addNotification } = useNotification();
  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleApplyPromo = () => {
    if (applyPromoCode(promoCode)) {
      addNotification('success', 'Promo code applied!');
      setPromoCode('');
    } else {
      addNotification('error', 'Invalid promo code');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderNumber = `ORD-${Date.now()}`;
      generatePDF(cart, total, discount, orderNumber);
      addNotification('success', 'Order placed successfully!');
      clearCart();
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  const generatePDF = (cart, total, discount, orderNumber) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('PHARMACY INVOICE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order #: ${orderNumber}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 47);
    doc.line(20, 60, 190, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 20, 70);
    doc.text('Qty', 120, 70);
    doc.text('Price', 145, 70);
    doc.text('Total', 170, 70);
    doc.line(20, 73, 190, 73);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    let yPos = 82;
    cart.forEach((item) => {
      doc.text(item.name.substring(0, 35), 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.price.toFixed(2)}`, 145, yPos);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos);
      yPos += 7;
    });
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    const subtotal = total / (1 - discount);
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);
    yPos += 7;
    if (discount > 0) {
      doc.text(`Discount (${(discount * 100).toFixed(0)}%):`, 140, yPos);
      doc.text(`-$${(subtotal * discount).toFixed(2)}`, 170, yPos);
      yPos += 7;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, yPos);
    doc.text(`$${total.toFixed(2)}`, 170, yPos);
    doc.save(`invoice-${orderNumber}.pdf`);
  };

  const subtotal = total / (1 - discount);
  const discountAmount = subtotal * discount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-[var(--color-card)] shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[var(--color-primary)]" />
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">Shopping Cart</h2>
                  <p className="text-sm text-[var(--color-text)] opacity-60">{cart.length} items</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--color-background)] rounded-lg">
                <X className="w-6 h-6 text-[var(--color-text)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <img src="https://mgx-backend-cdn.metadl.com/generate/images/920366/2026-01-20/68eb3bfe-fc39-4055-b614-8a36d95a27f3.png" alt="Empty" className="w-48 h-48 mb-4 opacity-50" />
                  <p className="text-xl font-semibold text-[var(--color-text)] mb-2">Your cart is empty</p>
                  <p className="text-[var(--color-text)] opacity-60">Add some medicines to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div key={item.medicineId} layout className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)]">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--color-text)] mb-1">{item.name}</h3>
                          <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">${item.price.toFixed(2)} each</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-[var(--color-card)] rounded-lg p-1 border border-[var(--color-border)]">
                              <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-background)] rounded">
                                <Minus className="w-4 h-4 text-[var(--color-text)]" />
                              </button>
                              <span className="w-8 text-center font-semibold text-[var(--color-text)]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-background)] rounded">
                                <Plus className="w-4 h-4 text-[var(--color-text)]" />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.medicineId)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                            <div className="ml-auto">
                              <p className="text-lg font-bold text-[var(--color-primary)]">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Add notes"
                            value={item.notes || ''}
                            onChange={(e) => updateNotes(item.medicineId, e.target.value)}
                            className="mt-2 w-full px-3 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text)] opacity-40" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <button onClick={handleApplyPromo} className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg font-medium hover:bg-opacity-90">
                    Apply
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[var(--color-text)]">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({(discount * 100).toFixed(0)}%):</span>
                      <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-[var(--color-text)] pt-2 border-t border-[var(--color-border)]">
                    <span>Total:</span>
                    <span className="text-[var(--color-primary)]">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const orderNumber = `ORD-${Date.now()}`;
                      generatePDF(cart, total, discount, orderNumber);
                      addNotification('success', 'Invoice downloaded!');
                    }}
                    className="flex-1 px-4 py-3 bg-[var(--color-background)] text-[var(--color-text)] rounded-lg font-medium hover:bg-opacity-80 flex items-center justify-center gap-2 border border-[var(--color-border)]"
                  >
                    <Download className="w-5 h-5" />Invoice
                  </button>
                  <button onClick={handleCheckout} disabled={isCheckingOut} className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== MAIN COMPONENT ====================

const PharmacyDashboard = () => {
  const [theme, setThemeState] = useState(() => localStorage.getItem('pharmacy-theme') || 'light');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pharmacy-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [discount, setDiscount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [medicines] = useState(generateMedicines());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const colors = THEMES[theme];
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    document.documentElement.className = theme === 'dark' || theme === 'carbon' ? 'dark' : '';
    localStorage.setItem('pharmacy-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pharmacy-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.medicineId === item.medicineId);
      if (existing) {
        return prev.map((i) => i.medicineId === item.medicineId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (medicineId) => {
    setCart((prev) => prev.filter((item) => item.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart((prev) => prev.map((item) => item.medicineId === medicineId ? { ...item, quantity } : item));
  };

  const updateNotes = (medicineId, notes) => {
    setCart((prev) => prev.map((item) => item.medicineId === medicineId ? { ...item, notes } : item));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const applyPromoCode = (code) => {
    const promoCodes = { 'HEALTH10': 0.1, 'SAVE20': 0.2, 'FIRST15': 0.15, 'WELCOME25': 0.25 };
    const discountValue = promoCodes[code.toUpperCase()];
    if (discountValue) {
      setDiscount(discountValue);
      return true;
    }
    return false;
  };

  const addNotification = (type, message, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 - discount);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredMedicines = useMemo(() => {
    setIsLoading(true);
    let result = medicines;
    if (selectedCategory !== 'All') {
      result = result.filter((med) => med.category === selectedCategory);
    }
    if (debouncedSearch.trim()) {
      const fuse = new Fuse(result, { keys: ['name', 'category', 'type'], threshold: 0.3 });
      result = fuse.search(debouncedSearch).map((r) => r.item);
    }
    setTimeout(() => setIsLoading(false), 100);
    return result;
  }, [selectedCategory, debouncedSearch, medicines]);

  const categoryCounts = useMemo(() => {
    const counts = { All: medicines.length };
    medicines.forEach((med) => {
      counts[med.category] = (counts[med.category] || 0) + 1;
    });
    return counts;
  }, [medicines]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, colors: THEMES[theme] }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateNotes, clearCart, total, itemCount, applyPromoCode, discount }}>
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
          <div className="min-h-screen bg-[var(--color-background)] transition-colors duration-300">
            <Navbar onSearchChange={setSearchQuery} onCartClick={() => setIsCartOpen(true)} />

            <div className="relative h-64 overflow-hidden">
              <img src="https://mgx-backend-cdn.metadl.com/generate/images/920366/2026-01-20/a713a997-9cf9-4a0d-8346-993300e60657.png" alt="Pharmacy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">
                    Your Health, Our Priority
                  </motion.h1>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl">
                    Quality medicines at affordable prices
                  </motion.p>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <CategorySidebar selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} categoryCounts={categoryCounts} />
                </div>

                <div className="lg:col-span-3">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedCategory === 'All' ? 'All Medicines' : selectedCategory}</h2>
                      <p className="text-[var(--color-text)] opacity-60">{filteredMedicines.length} products found</p>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
                    </div>
                  ) : filteredMedicines.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">No medicines found</h3>
                      <p className="text-[var(--color-text)] opacity-60">Try adjusting your search or filter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredMedicines.map((medicine) => (
                        <ProductCard key={medicine.id} medicine={medicine} onDetailsClick={setSelectedMedicine} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ProductModal medicine={selectedMedicine} onClose={() => setSelectedMedicine(null)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <ToastContainer notifications={notifications} onClose={removeNotification} />
          </div>
        </NotificationContext.Provider>
      </CartContext.Provider>
    </ThemeContext.Provider>
  );
};

export default PharmacyDashboard;