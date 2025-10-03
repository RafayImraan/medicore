import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

// Global error handler for unhandled promise rejections (like MetaMask errors)
window.addEventListener('unhandledrejection', (event) => {
  // Check if it's a MetaMask-related error
  if (event.reason && event.reason.message && event.reason.message.includes('MetaMask')) {
    console.warn('MetaMask connection error handled:', event.reason.message);
    event.preventDefault(); // Prevent the error from being logged as unhandled
  }
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  // Check if it's a MetaMask-related error
  if (event.message && event.message.includes('MetaMask')) {
    console.warn('MetaMask error handled:', event.message);
    event.preventDefault(); // Prevent default error handling
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
