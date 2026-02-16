import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Fuse from 'fuse.js';
import {
  ShoppingCart, Search, Menu, X, Palette, User, Info, AlertCircle, Clock, Package,
  Plus, Minus, Trash2, Download, Tag, CheckCircle, Building2, AlertTriangle,
  Loader2, XCircle, Heart, Star, Filter, SlidersHorizontal, Eye, BarChart3,
  Zap, Sparkles, Crown, Gem, Leaf, Sun, Moon, Zap as Lightning, Gift, Truck,
  CreditCard, MapPin, Phone, Mail, Calendar, Award, Save, RotateCcw,
  ChevronRight, ChevronLeft, UserCheck, Gift as GiftIcon
} from 'lucide-react';
import { apiRequest } from '../services/api';

// ==================== TYPES & CONSTANTS ====================

const THEMES = {
  premium: {
    primary: '#0F5132', // Dark emerald
    secondary: '#FF4D4F', // Neon red/orange
    background: '#0F1720', // Charcoal
    card: '#1E293B', // Darker charcoal
    text: '#FFFFFF', // Pure white text for dark backgrounds
    border: '#334155', // Muted border
    accent: '#D4AF37', // Luxury gold
    muted: '#9AA3A8', // Cool grey
  },
  light: {
    primary: '#0F5132',
    secondary: '#FF4D4F',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F1720',
    border: '#E2E8F0',
    accent: '#D4AF37',
    muted: '#64748B',
  },
  luxury: {
    primary: '#D4AF37', // Gold
    secondary: '#8B4513', // Saddle brown
    background: '#1A1A1A', // Dark charcoal
    card: '#2A2A2A', // Darker charcoal
    text: '#F5F5DC', // Beige
    border: '#4A4A4A', // Dark grey
    accent: '#FFD700', // Gold
    muted: '#B8860B', // Dark goldenrod
  },
  nature: {
    primary: '#228B22', // Forest green
    secondary: '#32CD32', // Lime green
    background: '#F0F8FF', // Alice blue
    card: '#FFFFFF', // White
    text: '#2F4F2F', // Dark green
    border: '#98FB98', // Pale green
    accent: '#00FF7F', // Spring green
    muted: '#556B2F', // Dark olive green
  },
  minimalist: {
    primary: '#2C3E50', // Dark blue grey
    secondary: '#34495E', // Wet asphalt
    background: '#ECF0F1', // Clouds
    card: '#FFFFFF', // White
    text: '#2C3E50', // Dark blue grey
    border: '#BDC3C7', // Silver
    accent: '#7F8C8D', // Asbestos
    muted: '#95A5A6', // Concrete
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

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-[var(--color-card)] rounded-xl shadow-md overflow-hidden border border-[var(--color-border)]"
      >
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              ))}
            </div>
            <div className="w-8 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-20 animate-pulse" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

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
    { value: 'premium', label: 'Premium', color: '#0F5132' },
    { value: 'luxury', label: 'Luxury Gold', color: '#D4AF37' },
    { value: 'nature', label: 'Nature', color: '#228B22' },
    { value: 'minimalist', label: 'Minimalist', color: '#2C3E50' },
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
              <h1 className="text-white text-xl font-bold text-[var(--color-text)]">MediCare Pharmacy</h1>
              <p className="text-white text-xs text-[var(--color-text)] opacity-60">Your Health, Our Priority</p>
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
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-lg hover:bg-[var(--color-background)]">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-text)]" />
            </button>
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
    <h2 className="text-white text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
      <span>📋</span>Categories
    </h2>
    <div className="text-white bg-[var(--color-background)] space-y-2">
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const daysUntilExpiry = Math.ceil((new Date(medicine.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isLowStock = medicine.quantity < 20;
  const isExpiringSoon = daysUntilExpiry < 90;
  const discountedPrice = medicine.discount > 0 ? medicine.price * (1 - medicine.discount / 100) : medicine.price;

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        medicineId: medicine.id,
        name: medicine.name,
        price: discountedPrice,
        quantity: 1,
        image: medicine.image,
        type: medicine.type,
      });
      addNotification('success', `${medicine.name} added to cart!`);
      setIsAdding(false);
    }, 300);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    addNotification('success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-[var(--color-card)] rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[var(--color-border)] backdrop-blur-sm"
    >
      {/* Premium badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {medicine.isPopular && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" />Popular
          </span>
        )}
        {medicine.isNew && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-teal-500 text-white flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />New
          </span>
        )}
        {medicine.discount > 0 && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center gap-1 shadow-lg">
            <Tag className="w-3 h-3" />-{medicine.discount}%
          </span>
        )}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[medicine.type] || 'bg-gray-100 text-gray-800'} shadow-lg`}>
          {medicine.type}
        </span>
        {isLowStock && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 shadow-lg">
            <AlertCircle className="w-3 h-3" />Low Stock
          </span>
        )}
        {isExpiringSoon && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1 shadow-lg">
            <Clock className="w-3 h-3" />Expiring Soon
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleWishlist}
          className={`p-2 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDetailsClick(medicine)}
          className="p-2 bg-white/90 text-[var(--color-primary)] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Product image with premium overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 z-0" />
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
      </div>

      {/* Product details */}
      <div className="p-4 relative">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(medicine.rating)}
          </div>
          <span className="text-xs text-[var(--color-text)] opacity-60">
            ({medicine.reviews})
          </span>
        </div>

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

        {/* Price section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {medicine.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-[var(--color-primary)]">${discountedPrice.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text)] opacity-60 line-through">${medicine.price.toFixed(2)}</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    Save ${(medicine.price - discountedPrice).toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-[var(--color-primary)]">${medicine.price.toFixed(2)}</span>
                <span className="text-xs text-[var(--color-text)] opacity-60">/ unit</span>
              </>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding || medicine.quantity === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg ${
              isAdding || medicine.quantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:shadow-xl'
            }`}
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
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="text-white fixed right-0 top-0 h-full w-full sm:w-[480px] bg-black dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[var(--color-primary)]" />
                <div>
                  <h2 className="text-white text-2xl font-bold text-[var(--color-text)]">Shopping Cart</h2>
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

// ==================== NEW PHASE 2 COMPONENTS ====================


const PharmacyDashboard = () => {
  const [theme, setThemeState] = useState(() => localStorage.getItem('pharmacy-theme') || 'light');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pharmacy-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [discount, setDiscount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50],
    stockLevel: 'all', // all, low, medium, high
    expiryDays: 365,
    rating: 0,
    showDiscounted: false,
    showPopular: false,
    showNew: false,
  });
  const [showFilters, setShowFilters] = useState(false);

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
    let alive = true;
    const loadMedicines = async () => {
      setIsLoading(true);
      try {
        const data = await apiRequest('/api/public/pharmacy');
        if (!alive) return;
        setMedicines(Array.isArray(data) ? data.map(item => ({ ...item, id: item.id || item._id })) : []);
      } catch (err) {
        console.error('Failed to load pharmacy catalog:', err);
        if (alive) setMedicines([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    loadMedicines();
    return () => { alive = false; };
  }, []);

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
    let result = medicines;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((med) => med.category === selectedCategory);
    }

    // Search filter
    if (debouncedSearch.trim()) {
      const fuse = new Fuse(result, { keys: ['name', 'category', 'type'], threshold: 0.3 });
      result = fuse.search(debouncedSearch).map((r) => r.item);
    }

    // Price range filter
    result = result.filter((med) => {
      const price = med.discount > 0 ? med.price * (1 - med.discount / 100) : med.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Stock level filter
    if (filters.stockLevel !== 'all') {
      result = result.filter((med) => {
        switch (filters.stockLevel) {
          case 'low':
            return med.quantity <= 20;
          case 'medium':
            return med.quantity > 20 && med.quantity <= 100;
          case 'high':
            return med.quantity > 100;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((med) => med.rating >= filters.rating);
    }

    // Special filters
    if (filters.showDiscounted) {
      result = result.filter((med) => med.discount > 0);
    }
    if (filters.showPopular) {
      result = result.filter((med) => med.isPopular);
    }
    if (filters.showNew) {
      result = result.filter((med) => med.isNew);
    }

    return result;
  }, [selectedCategory, debouncedSearch, medicines, filters]);

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

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[var(--color-card)] border-b border-[var(--color-border)] overflow-hidden"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Price Range</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={filters.priceRange[0]}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            placeholder="Min"
                          />
                          <span className="text-[var(--color-text)]">-</span>
                          <input
                            type="number"
                            value={filters.priceRange[1]}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      {/* Stock Level */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Stock Level</label>
                        <select
                          value={filters.stockLevel}
                          onChange={(e) => setFilters(prev => ({ ...prev, stockLevel: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                          <option value="all">All Stock Levels</option>
                          <option value="low">Low Stock (≤20)</option>
                          <option value="medium">Medium Stock (21-100)</option>
                          <option value="high">High Stock (≥100)</option>
                        </select>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Minimum Rating</label>
                        <select
                          value={filters.rating}
                          onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                          <option value={0}>Any Rating</option>
                          <option value={3}>3+ Stars</option>
                          <option value={4}>4+ Stars</option>
                          <option value={4.5}>4.5+ Stars</option>
                        </select>
                      </div>

                      {/* Special Filters */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Special Filters</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.showDiscounted}
                              onChange={(e) => setFilters(prev => ({ ...prev, showDiscounted: e.target.checked }))}
                              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-sm text-[var(--color-text)]">Discounted Only</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.showPopular}
                              onChange={(e) => setFilters(prev => ({ ...prev, showPopular: e.target.checked }))}
                              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-sm text-[var(--color-text)]">Popular Only</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.showNew}
                              onChange={(e) => setFilters(prev => ({ ...prev, showNew: e.target.checked }))}
                              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-sm text-[var(--color-text)]">New Only</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setFilters({
                          priceRange: [0, 50],
                          stockLevel: 'all',
                          expiryDays: 365,
                          rating: 0,
                          showDiscounted: false,
                          showPopular: false,
                          showNew: false,
                        })}
                        className="px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] rounded-lg transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

                <div className="text-white lg:col-span-3">
                  <div className="text-white mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-white text-2xl font-bold text-[var(--color-text)]">{selectedCategory === 'All' ? 'All Medicines' : selectedCategory}</h2>
                      <p className="text-white text-[var(--color-text)] opacity-60">{filteredMedicines.length} products found</p>
                    </div>
                  </div>

                  {isLoading ? (
                    <SkeletonLoader />
                  ) : filteredMedicines.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-white text-2xl font-bold text-[var(--color-text)] mb-2">No medicines found</h3>
                      <p className="text-white text-[var(--color-text)] opacity-60">Try adjusting your search or filter</p>
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
