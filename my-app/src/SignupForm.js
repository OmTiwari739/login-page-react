import { useState } from "react";

// Home Page Component
function HomePage({ user, onLogout, darkMode, setDarkMode, leftColor, rightColor }) {
  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "text-black"
        }`}
      style={{
        background: darkMode
          ? ""
          : `linear-gradient(135deg, ${leftColor}, ${rightColor})`,
      }}
    >
      {/* Navigation Header */}
      <nav className={`p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-white/20'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🏠 Welcome Home</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${darkMode
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-semibold text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Welcome Card */}
        <div
          className={`rounded-xl shadow-xl p-5 mb-6 transition-all duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              🎉 Welcome, {user.username || user.email}!
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You've successfully {user.isNewUser ? 'created an account' : 'logged in'}!
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div
            className={`rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg`}
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-lg font-bold mb-1">Dashboard</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              View your analytics and insights
            </p>
          </div>

          <div
            className={`rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg`}
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="text-lg font-bold mb-1">Settings</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Customize your experience
            </p>
          </div>

          <div
            className={`rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg`}
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-bold mb-1">Community</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with other users
            </p>
          </div>

          <div
            className={`rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg`}
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="text-lg font-bold mb-1">Resources</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Learn and grow with our guides
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`rounded-xl shadow-xl p-5 mt-6 transition-all duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
        >
          <h3 className="text-lg font-bold mb-4">📈 Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: "🎯", action: "Completed profile setup", time: "2 minutes ago" },
              { icon: "🔐", action: "Account verified", time: "Just now" },
              { icon: "🎨", action: "Customized theme colors", time: "A moment ago" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-102 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <div className="text-lg">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.action}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Auth Form Component
function AuthForm({ onLogin, darkMode, setDarkMode, leftColor, rightColor, setLeftColor, setRightColor }) {
  const [activeField, setActiveField] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear email error when user starts typing
    if (field === "email" && emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = () => {
    // Email validation
    if (!formData.email) {
      setEmailError("Please enter your email address!");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address!");
      return;
    }

    // Other validations
    if (!formData.password) {
      alert("Please enter your password!");
      return;
    }

    if (!isLogin && !formData.username) {
      alert("Please enter a username!");
      return;
    }

    // Simulate successful login/signup
    const userData = {
      email: formData.email,
      username: formData.username || formData.email.split('@')[0],
      isNewUser: !isLogin
    };

    onLogin(userData);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "text-black"
        }`}
      style={{
        background: darkMode
          ? ""
          : `linear-gradient(135deg, ${leftColor}, ${rightColor})`,
      }}
    >
      <div
        className={`rounded-xl shadow-xl p-5 w-full max-w-sm relative transition-all duration-500 transform hover:scale-105 ${darkMode ? "bg-gray-800 text-white shadow-gray-900/50" : "bg-white shadow-black/20"
          }`}
      >
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${darkMode
            ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-400/30"
            : "bg-gray-800 text-white hover:bg-gray-700 shadow-gray-800/30"
            } shadow-lg`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Emoji Animation Container */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative h-10 w-10 flex items-center justify-center">
            {activeField === "username" && (
              <div
                className="text-3xl absolute transition-all duration-500 ease-out"
                style={{
                  animation: "fadeInBounce 0.6s ease-out",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                }}
              >
                👀
              </div>
            )}
            {activeField === "email" && (
              <div
                className="text-3xl absolute transition-all duration-500 ease-out"
                style={{
                  animation: "fadeInBounce 0.6s ease-out",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                }}
              >
                📧
              </div>
            )}
            {activeField === "password" && (
              <div
                className="text-3xl absolute transition-all duration-500 ease-out"
                style={{
                  animation: "fadeInShake 0.6s ease-out",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                }}
              >
                🙈
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back!" : "Join Us!"}
        </h2>

        {/* Input Fields */}
        <div className="space-y-3">
          {!isLogin && (
            <div className="transform transition-all duration-300 hover:scale-102">
              <label className={`block mb-1 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                👤 Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-400/50 outline-none bg-transparent transition-all duration-300 hover:border-indigo-300 text-sm ${darkMode ? 'border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'
                  } ${activeField === "username" ? 'scale-105 shadow-lg' : ''}`}
                placeholder="Choose your username"
              />
            </div>
          )}

          <div className="transform transition-all duration-300 hover:scale-102">
            <label className={`block mb-1 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              ✉️ Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-400/50 outline-none bg-transparent transition-all duration-300 hover:border-indigo-300 text-sm ${darkMode ? 'border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'
                } ${activeField === "email" ? 'scale-105 shadow-lg' : ''} ${emailError ? 'border-red-500 focus:ring-red-400/50' : ''}`}
              placeholder="Enter your email address"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {emailError}
              </p>
            )}
          </div>

          <div className="transform transition-all duration-300 hover:scale-102">
            <label className={`block mb-1 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              🔒 Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-pink-400/50 outline-none bg-transparent transition-all duration-300 hover:border-pink-300 text-sm ${darkMode ? 'border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'
                } ${activeField === "password" ? 'scale-105 shadow-lg' : ''}`}
              placeholder="Create a secure password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold text-sm mt-5 relative overflow-hidden group"
            style={{
              background: `linear-gradient(90deg, ${leftColor}, ${rightColor})`,
            }}
          >
            <span className="relative z-10">
              {isLogin ? "🚀 Login" : "✨ Create Account"}
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Toggle between Login & Signup */}
        <div className="text-center mt-5">
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "New to our platform?" : "Already part of the family?"}{" "}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 font-bold hover:text-indigo-400 transition-all duration-200 hover:scale-110 inline-block mt-1 text-sm"
          >
            {isLogin ? "🎯 Sign Up Now" : "👋 Login Here"}
          </button>
        </div>

        {/* Color Customization Panel */}
        <div className={`mt-3 p-3 rounded-lg border-2 border-dashed transition-all duration-300 ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
          }`}>
          <h3 className="text-xs font-semibold mb-2 text-center">🎨 Customize Colors</h3>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1 font-medium opacity-80">Left</label>
              <input
                type="color"
                value={leftColor}
                onChange={(e) => setLeftColor(e.target.value)}
                className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-lg hover:scale-110 transition-transform duration-200 shadow-md"
              />
            </div>
            <div className="flex-1 mx-3">
              <div
                className="h-4 rounded-md shadow-inner"
                style={{
                  background: `linear-gradient(90deg, ${leftColor}, ${rightColor})`,
                }}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1 font-medium opacity-80">Right</label>
              <input
                type="color"
                value={rightColor}
                onChange={(e) => setRightColor(e.target.value)}
                className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-lg hover:scale-110 transition-transform duration-200 shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="mt-3 text-center text-xs opacity-60">
          🌈 Made with love and code
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState("auth"); // "auth" or "home"
  const [user, setUser] = useState(null);
  const [leftColor, setLeftColor] = useState("#4f46e5");
  const [rightColor, setRightColor] = useState("#ec4899");
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("auth");
  };

  return (
    <>
      {currentPage === "auth" ? (
        <AuthForm
          onLogin={handleLogin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          leftColor={leftColor}
          rightColor={rightColor}
          setLeftColor={setLeftColor}
          setRightColor={setRightColor}
        />
      ) : (
        <HomePage
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          leftColor={leftColor}
          rightColor={rightColor}
        />
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeInBounce {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInShake {
          0% {
            opacity: 0;
            transform: scale(0.3) translateX(-10px);
          }
          25% {
            opacity: 0.5;
            transform: scale(0.8) translateX(5px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) translateX(-3px);
          }
          75% {
            opacity: 0.9;
            transform: scale(1.05) translateX(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}