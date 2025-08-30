import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthForm() {
  const [leftColor, setLeftColor] = useState("#4f46e5");
  const [rightColor, setRightColor] = useState("#ec4899");
  const [activeField, setActiveField] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // Toggle between login/signup
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "text-black"
      }`}
      style={{
        background: darkMode
          ? "" // Dark mode uses solid background
          : `linear-gradient(135deg, ${leftColor}, ${rightColor})`, // Light mode keeps gradient
      }}
    >
      <div
        className={`rounded-2xl shadow-2xl p-8 w-full max-w-md relative transition-colors duration-500 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-sm font-semibold transition ${
            darkMode
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Hacker Animation */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            {activeField === "username" && (
              <motion.div
                key="peek"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl"
              >
                👀
              </motion.div>
            )}
            {activeField === "password" && (
              <motion.div
                key="hide"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl"
              >
                🙈
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent"
              />
            </div>
          )}

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              onFocus={() => setActiveField("username")}
              onBlur={() => setActiveField(null)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none bg-transparent"
            />
          </div>

          {/* Login/Create Account Button */}
          <button
            className="w-full text-white py-2 rounded-lg transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, ${leftColor}, ${rightColor})`,
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Toggle between Login & Signup */}
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {/* Color Pickers */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <label className="text-sm mb-1">Left Color</label>
            <input
              type="color"
              value={leftColor}
              onChange={(e) => setLeftColor(e.target.value)}
              className="w-12 h-8 cursor-pointer border-0 bg-transparent appearance-none"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm mb-1">Right Color</label>
            <input
              type="color"
              value={rightColor}
              onChange={(e) => setRightColor(e.target.value)}
              className="w-12 h-8 cursor-pointer border-0 bg-transparent appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
