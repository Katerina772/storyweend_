import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const next = {};

    const name = form.username.trim();
    if (!name) next.username = "Введіть ім'я користувача";
    else if (name.length < 3) next.username = "Мінімум 3 символи";
    else if (name.length > 50) next.username = "Максимум 50 символів";

    if (!form.email.trim()) next.email = "Введіть email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Некоректний email";

    if (!form.password) next.password = "Введіть пароль";
    else if (form.password.length < 6) next.password = "Мінімум 6 символів";

    if (form.password !== form.confirm) next.confirm = "Паролі не співпадають";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      await register(form.username.trim(), form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Не вдалося зареєструватися. Спробуйте ще раз.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2 text-center">
          Реєстрація
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Створіть акаунт для роботи над вигаданими світами
        </p>

        {serverError && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Ім'я користувача"
            type="text"
            placeholder="worldbuilder"
            value={form.username}
            onChange={handleChange("username")}
            error={errors.username}
            autoComplete="username"
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Мінімум 6 символів"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Підтвердження пароля"
            type="password"
            placeholder="Повторіть пароль"
            value={form.confirm}
            onChange={handleChange("confirm")}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Створення..." : "Зареєструватися"}
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Вже є акаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
