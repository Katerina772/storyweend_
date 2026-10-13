import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Badge } from "../../components/ui/Badge.jsx";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    avatar: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || form.username.trim().length < 3) {
      setError("Ім'я користувача має містити мінімум 3 символи");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await updateUser({
        username: form.username.trim(),
        avatar: form.avatar.trim() || null,
        bio: form.bio.trim() || null,
      });
      setSuccess("Профіль оновлено!");
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося оновити профіль");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Профіль</h1>

      {/* Заголовок із аватаркою */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl text-slate-500">
              {user.username[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-slate-100">
              {user.username}
            </h2>
            {user.role === "ADMIN" && <Badge color="yellow">Адмін</Badge>}
          </div>
          <p className="text-sm text-slate-400">{user.email}</p>
          <p className="text-xs text-slate-500 mt-1">
            Зареєстрований:{" "}
            {new Date(user.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>

      {/* Форма редагування */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Редагувати профіль
        </h2>

        {success && (
          <div className="mb-4 px-3 py-2 rounded bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Ім'я користувача *"
            value={form.username}
            onChange={handleChange("username")}
            maxLength={50}
          />

          <Input
            label="Аватар (URL)"
            placeholder="https://..."
            value={form.avatar}
            onChange={handleChange("avatar")}
          />

          <Textarea
            label="Короткий опис"
            placeholder="Автор фентезі-світів, розробник ігор..."
            value={form.bio}
            onChange={handleChange("bio")}
            rows={3}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </form>
      </div>

      {/* Інформація про email */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">Email</h2>
        <p className="text-sm text-slate-400">
          {user.email} — email не можна змінити в цій версії платформи.
        </p>
      </div>
    </div>
  );
}
