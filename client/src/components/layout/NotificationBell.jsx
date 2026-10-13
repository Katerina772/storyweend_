import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { notificationsApi } from "../../api/notifications.api.js";
import { Loader } from "../ui/Loader.jsx";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const { count } = await notificationsApi.unreadCount();
      setUnreadCount(count);
    } catch {
      // Тихо ігноруємо помилку
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { notifications } = await notificationsApi.list({ limit: 20 });
      setNotifications(notifications);
    } catch {
      // Тихо ігноруємо
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантажуємо лічильник при старті і кожні 30 секунд
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  // Завантажуємо список при відкритті
  useEffect(() => {
    if (open) loadNotifications();
  }, [open, loadNotifications]);

  // Закриваємо при кліку поза межами
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Тихо
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
    } catch {
      // Тихо
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsApi.remove(id);
      const wasUnread = notifications.find((n) => n.id === id && !n.readAt);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Тихо
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-slate-300 hover:text-slate-100 transition"
        aria-label="Сповіщення"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
          {/* Заголовок */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-100">Сповіщення</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Позначити всі прочитаними
              </button>
            )}
          </div>

          {/* Список */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <Loader message="Завантаження..." />
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                Немає сповіщень
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.readAt;
                const content = (
                  <div
                    className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition cursor-pointer relative group ${
                      isUnread ? "bg-slate-800/30" : ""
                    }`}
                    onClick={() => {
                      if (isUnread) handleMarkAsRead(n.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm line-clamp-1 ${
                            isUnread
                              ? "text-slate-100 font-medium"
                              : "text-slate-300"
                          }`}
                        >
                          {n.title}
                        </div>
                        {n.message && (
                          <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {n.message}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mt-2">
                          {new Date(n.createdAt).toLocaleString("uk-UA")}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="text-slate-500 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition shrink-0"
                        title="Видалити"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );

                // Якщо є посилання — обгортаємо в Link
                return n.link ? (
                  <Link key={n.id} to={n.link} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })
            )}
          </div>

          {/* Футер */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-700 px-4 py-2 text-center">
              <button
                onClick={() => loadNotifications()}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Оновити
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
