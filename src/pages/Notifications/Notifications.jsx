import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../../services/notifications";
import { Heart, MessageSquare, User, Repeat, Reply, Bell, CheckCircle } from "lucide-react";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifIcon(type) {
  const icons = {
    like: <Heart size={14} className="text-red-500 fill-current" />,
    comment: <MessageSquare size={14} className="text-blue-500" />,
    follow: <User size={14} className="text-green-500" />,
    share: <Repeat size={14} className="text-purple-500" />,
    reply: <Reply size={14} className="text-orange-500" />,
  };
  return icons[type] || <Bell size={14} className="text-gray-500" />;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState("all"); // all | unread
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  async function fetchNotifications(unread = false) {
    setLoading(true);
    const res = await getNotifications(unread);
    if (res?.data?.notifications) setNotifications(res.data.notifications);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (mounted) await fetchNotifications(tab === "unread");
    }
    load();
    return () => { mounted = false; };
  }, [tab]);

  async function handleMarkAll() {
    setMarkingAll(true);
    await markAllAsRead();
    await fetchNotifications(tab === "unread");
    setMarkingAll(false);
  }

  async function handleMarkOne(id) {
    await markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">

          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Realtime updates for likes, comments, shares, and follows.
              </p>
            </div>
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition disabled:opacity-50 mt-1">
              <CheckCircle size={16} /> {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          </div>

          <div className="flex px-6 pt-4 gap-2">
            {[["all", "All"], ["unread", "Unread"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition
                  ${tab === key
                    ? "bg-blue-800 text-white dark:bg-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-4 flex flex-col gap-2 mt-2">
            {loading ? (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 flex flex-col items-center">
                <Bell size={48} className="mb-3 text-gray-300 dark:text-gray-600" />
                <p className="font-medium">No notifications yet.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkOne(n._id)}
                  className={`flex items-start gap-4 p-4 rounded-xl transition cursor-pointer
                    ${!n.read ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50" : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700"}`}>

                  <div className="relative">
                    <img
                      src={n.sender?.photo || `https://ui-avatars.com/api/?name=${n.sender?.name}&background=1a237e&color=fff`}
                      alt={n.sender?.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                      {notifIcon(n.type)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{n.sender?.name}</span>{" "}
                      {n.message || n.type}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>

                  {!n.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}