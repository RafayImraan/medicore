import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Gem, Crown } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the new login function from AuthContext
        login(data.user, data.token, data.refreshToken);

        // Redirect to role-based dashboard
        const role = data.user.role;
        if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "doctor") {
          navigate("/dashboard/doctor");
        } else if (role === "nurse") {
          navigate("/dashboard/nurse");
        } else if (role === "patient") {
          navigate("/dashboard/patient");
        } else {
          setError("Invalid role. Cannot redirect.");
        }
      } else {
        setError(data.error || "Invalid login");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/30 to-charcoal-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft background gradient behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-luxury-gold/5"></div>

      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-20 right-20 text-luxury-gold/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Gem size={24} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 text-primary-400/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <Crown size={20} />
      </motion.div>

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-charcoal-800/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl shadow-charcoal-950/30 border border-primary-900/40 relative">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-charcoal-900/20 rounded-2xl"></div>

          <div className="text-center mb-8 relative z-10">
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              WELCOME BACK
            </motion.h2>
            <p className="text-muted-400 mt-2 font-medium tracking-wide">Sign in to your premium healthcare account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-4 text-red-200 text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-muted-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-500 w-5 h-5" />
                <motion.input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white placeholder-muted-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 transition-all duration-300 shadow-lg shadow-charcoal-950/20"
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
                />
                {/* Animated gradient underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-luxury-gold rounded-full"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-muted-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-500 w-5 h-5" />
                <motion.input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white placeholder-muted-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 transition-all duration-300 shadow-lg shadow-charcoal-950/20"
                  placeholder="Enter your password"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-500 hover:text-muted-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {/* Animated gradient underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-luxury-gold rounded-full"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-charcoal-800 border-primary-800 rounded focus:ring-primary-600 focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-muted-400">
                Remember me
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-900 to-primary-800 hover:from-primary-800 hover:to-primary-700 text-luxury-gold font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-900 disabled:hover:to-primary-800 relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              animate={isLoading ? {} : { scale: [1, 1.02, 1] }}
              transition={isLoading ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-luxury-gold/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </motion.button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <div className="text-muted-400 text-sm">
              <span>Don't have an account? </span>
              <motion.a
                href="/register"
                className="text-primary-400 hover:text-luxury-gold transition-colors duration-300 font-medium relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                Create one here
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-luxury-gold rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
