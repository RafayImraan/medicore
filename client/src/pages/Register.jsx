import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || data.msg || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFieldActive = (field, value) => focusedField === field || value.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft background gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-luxury-gold/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-charcoal-950/50 via-transparent to-primary-800/10"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-charcoal-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-charcoal-950/50 border border-primary-900/30 relative overflow-hidden">
          {/* Gradient border and glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-luxury-gold/20 via-primary-300/10 to-luxury-silver/20 p-[1px]">
            <div className="h-full w-full bg-charcoal-800/50 backdrop-blur-xl rounded-2xl"></div>
          </div>
          {/* Layered shadows for floating effect */}
          <div className="absolute inset-0 rounded-2xl shadow-lg shadow-primary-900/20"></div>
          <div className="absolute inset-0 rounded-2xl shadow-md shadow-luxury-gold/10"></div>

          <div className="relative z-10">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider animate-gradient-x relative">
                CREATE ACCOUNT
                {/* Luxury iconography */}
                <div className="absolute -top-2 -right-2 text-luxury-gold opacity-50">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </h2>
              <p className="text-muted-400 mt-2 font-medium tracking-wide">
                Join our premium healthcare platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-accent-500/20 border border-accent-500/30 rounded-xl p-4 shadow-sm shadow-accent-500/10">
                  <p className="text-accent-400 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Name */}
              <div className="relative">
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  isFieldActive('name', name) ? 'top-2 text-xs text-primary-400' : 'top-1/2 -translate-y-1/2 text-muted-400'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    className="w-full px-4 py-3 pl-12 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white placeholder-transparent focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 focus:ring-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20 focus:shadow-xl focus:shadow-primary-600/30 focus:translate-y-[-2px]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {/* User icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  isFieldActive('email', email) ? 'top-2 text-xs text-primary-400' : 'top-1/2 -translate-y-1/2 text-muted-400'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder=""
                    className="w-full px-4 py-3 pl-12 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white placeholder-transparent focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 focus:ring-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20 focus:shadow-xl focus:shadow-primary-600/30 focus:translate-y-[-2px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {/* Envelope icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  isFieldActive('password', password) ? 'top-2 text-xs text-primary-400' : 'top-1/2 -translate-y-1/2 text-muted-400'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder=""
                    className="w-full px-4 py-3 pl-12 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white placeholder-transparent focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 focus:ring-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20 focus:shadow-xl focus:shadow-primary-600/30 focus:translate-y-[-2px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {/* Lock icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="relative">
                <label className="block text-sm font-medium text-muted-200 mb-2">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-800/50 border border-primary-800/30 rounded-xl text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/50 focus:ring-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20 focus:shadow-xl focus:shadow-primary-600/30 focus:bg-gradient-to-r focus:from-primary-900/20 focus:to-primary-800/20"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Healthcare Professional</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-primary-900 to-primary-800 hover:from-primary-800 hover:to-primary-700 text-luxury-gold font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/25 hover:shadow-primary-900/50 hover:shadow-luxury-gold/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none relative overflow-hidden ${
                  !isLoading ? 'animate-pulse' : ''
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </span>
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-luxury-silver/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-400 text-sm mb-4">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-luxury-gold/10 to-luxury-silver/10 hover:from-luxury-gold/20 hover:to-luxury-silver/20 text-luxury-gold font-semibold py-2 px-6 rounded-xl border border-luxury-gold/30 hover:border-luxury-gold/50 transition-all duration-300 shadow-md shadow-luxury-gold/10 hover:shadow-lg hover:shadow-luxury-gold/20 hover:scale-105"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
