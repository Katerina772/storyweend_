import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../api/admin.api.js";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { ErrorModal } from "../../components/ui/ErrorModal.jsx";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [changingUser, setChangingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (roleFilter) filters.role = roleFilter;
      const { users } = await adminApi.listUsers(filters);
      setUsers(users);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleChangeRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const { user } = await adminApi.changeRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: user.role } : u)),
      );
      setChangingUser(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Не вдалося змінити роль");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Користувачі</h1>
        <p className="text-sm text-slate-400 mt-1">
          {users.length} облікових записів
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Пошук за ім'ям або email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-yellow-500"
        >
          <option value="">Усі ролі</option>
          <option value="USER">Звичайні</option>
          <option value="ADMIN">Адміністратори</option>
        </select>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Користувач
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Роль
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Проєкти
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Зареєстрований
                </th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Нічого не знайдено
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-800 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-slate-500 text-xs">
                              {u.username[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-200 text-sm">
                          {u.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.role === "ADMIN" ? "yellow" : "gray"}>
                        {u.role === "ADMIN" ? "Адмін" : "Користувач"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {u._count.ownedProjects} власних ·{" "}
                      {u._count.projectMembers} участь
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setChangingUser(u)}
                      >
                        Змінити роль
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Модалка зміни ролі */}
      <Modal
        open={!!changingUser}
        onClose={() => setChangingUser(null)}
        title={`Змінити роль: ${changingUser?.username || ""}`}
      >
        {changingUser && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleChangeRole(changingUser.id, "USER")}
              disabled={actionLoading || changingUser.role === "USER"}
              className={`text-left px-4 py-3 rounded border transition ${
                changingUser.role === "USER"
                  ? "border-slate-500 bg-slate-800"
                  : "border-slate-700 bg-slate-800 hover:bg-slate-750"
              } disabled:opacity-50`}
            >
              <div className="font-medium text-slate-100 text-sm">
                Користувач
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Звичайний користувач платформи
              </div>
            </button>

            <button
              onClick={() => handleChangeRole(changingUser.id, "ADMIN")}
              disabled={actionLoading || changingUser.role === "ADMIN"}
              className={`text-left px-4 py-3 rounded border transition ${
                changingUser.role === "ADMIN"
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-slate-700 bg-slate-800 hover:bg-slate-750"
              } disabled:opacity-50`}
            >
              <div className="font-medium text-yellow-300 text-sm">
                Адміністратор
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Повний доступ до адмінпанелі
              </div>
            </button>
          </div>
        )}
      </Modal>

      <ErrorModal
        open={!!errorMessage}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </div>
  );
}
