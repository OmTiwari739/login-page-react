import { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

// Token management utilities
const tokenManager = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  isLoggedIn: () => !!localStorage.getItem('access_token')
};

// API Service Functions
const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    // Store tokens after successful signup
    tokenManager.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store tokens after successful login
    tokenManager.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  logout: async () => {
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API fails
      return { message: 'Logged out' };
    } finally {
      // Always clear tokens
      tokenManager.clearTokens();
    }
  },

  getProfile: async () => {
    const accessToken = tokenManager.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }
    return data;
  }
};

// Home Page Component
function HomePage({ user, onLogout, darkMode, setDarkMode, leftColor, rightColor }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);

  // Check session validity when component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!tokenManager.isLoggedIn()) {
          setSessionValid(false);
          setTimeout(() => {
            onLogout();
          }, 1000);
          return;
        }

        await authAPI.getProfile();
        setSessionValid(true);
      } catch (error) {
        console.error('Session invalid:', error);
        setSessionValid(false);
        // Auto logout if session is invalid
        setTimeout(() => {
          onLogout();
        }, 1000);
      }
    };
    checkSession();
  }, [onLogout]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authAPI.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear the frontend state
      onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!sessionValid) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

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
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-semibold text-sm ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoggingOut ? '⏳ Logging out...' : '🚪 Logout'}
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
              🎉 Welcome, {user.username}!
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You've successfully {user.isNewUser ? 'created an account' : 'logged in'}!
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              User ID: {user.user_id}
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (field === "email" && emailError) {
      setEmailError("");
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setEmailError("");
    setGeneralError("");

    // Validation
    if (!formData.email) {
      setEmailError("Please enter your email address!");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address!");
      return;
    }

    if (!formData.password) {
      setGeneralError("Please enter your password!");
      return;
    }

    if (!isLogin && !formData.username) {
      setGeneralError("Please enter a username!");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isLogin) {
        // Login API call - can use either username or email
        response = await authAPI.login({
          username: formData.username || formData.email,
          password: formData.password
        });
      } else {
        // Signup API call
        response = await authAPI.signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }

      // Success - login user with JWT data
      const userData = {
        user_id: response.user_id,
        username: response.username,
        isNewUser: !isLogin
      };
      
      onLogin(userData);

    } catch (error) {
      console.error('Auth error:', error);
      setGeneralError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmailError("");
    setGeneralError("");
    // Clear form when switching modes
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    });
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

        {/* Error Messages */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {generalError}
          </div>
        )}

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
                disabled={isLoading}
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
              disabled={isLoading}
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
              placeholder={isLogin ? "Enter your password" : "Create a secure password"}
              disabled={isLoading}
            />
          </div>

          {/* For login mode, show username field */}
          {isLogin && (
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
                placeholder="Enter your username"
                disabled={isLoading}
              />
              <p className="text-xs mt-1 text-gray-500">
                You can also use your email to login
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold text-sm mt-5 relative overflow-hidden group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: `linear-gradient(90deg, ${leftColor}, ${rightColor})`,
            }}
          >
            <span className="relative z-10">
              {isLoading 
                ? (isLogin ? "🔄 Logging in..." : "🔄 Creating account...") 
                : (isLogin ? "🚀 Login" : "✨ Create Account")
              }
            </span>
            {!isLoading && (
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            )}
          </button>
        </div>

        {/* Toggle between Login & Signup */}
        <div className="text-center mt-5">
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "New to our platform?" : "Already part of the family?"}{" "}
          </p>
          <button
            onClick={toggleAuthMode}
            disabled={isLoading}
            className={`text-indigo-500 font-bold hover:text-indigo-400 transition-all duration-200 hover:scale-110 inline-block mt-1 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={isLoading}
                className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-lg hover:scale-110 transition-transform duration-200 shadow-md disabled:opacity-50"
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
                disabled={isLoading}
                className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-lg hover:scale-110 transition-transform duration-200 shadow-md disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="mt-3 text-center">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            🔗 Connected to Django Backend (JWT)
          </p>
        </div>

        {/* Fun Footer */}
        <div className="mt-2 text-center text-xs opacity-60">
          🌈 Made with love and code
        </div>
      </div>

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
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState("auth"); 
  const [user, setUser] = useState(null);
  const [leftColor, setLeftColor] = useState("#4f46e5");
  const [rightColor, setRightColor] = useState("#ec4899");
  const [darkMode, setDarkMode] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkExistingLogin = async () => {
      if (tokenManager.isLoggedIn()) {
        try {
          const profileData = await authAPI.getProfile();
          setUser({
            user_id: profileData.user_id,
            username: profileData.username,
            isNewUser: false
          });
          setCurrentPage("home");
        } catch (error) {
          console.error('Invalid existing session:', error);
          tokenManager.clearTokens();
          setCurrentPage("auth");
        }
      }
    };
    
    checkExistingLogin();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    tokenManager.clearTokens();
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
    </>
  );
}
