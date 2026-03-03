import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Home, User, Bell, Menu, LogOut, Settings, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${pathname === path
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/feed" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[10px]"
            style={{ background: "#0f172a" }}>
            A-BOOK
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-lg">A-book</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/feed" className={linkClass("/feed")}>
            <Home size={18} /> <span>Feed</span>
          </Link>
          <Link to="/profile" className={linkClass("/profile")}>
            <User size={18} /> <span>Profile</span>
          </Link>
          <Link to="/notifications" className={linkClass("/notifications")}>
            <Bell size={18} /> <span>Notifications</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:shadow-sm transition bg-white dark:bg-gray-800"
            >
              <img
                src={user?.user?.photo || user?.photo || `https://ui-avatars.com/api/?name=${user?.user?.name || user?.name || "User"}&background=1a237e&color=fff`}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                {user?.user?.name || user?.name || "User"}
              </span>
              <Menu size={16} className="text-gray-500 dark:text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 border border-gray-100 dark:border-gray-700 z-50">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition w-full text-left" onClick={() => setMenuOpen(false)}>
                  <User size={16} className="text-gray-500 dark:text-gray-400" /> Profile
                </Link>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition w-full text-left">
                  <Settings size={16} className="text-gray-500 dark:text-gray-400" /> Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left">
                  <LogOut size={16} className="text-red-500 dark:text-red-400" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}