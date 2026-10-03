import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Якщо вже залогінений — редірект у кабінет
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Введіть email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Некоректний email";
    if (!form.password) next.password = "Введіть пароль";
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
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.error || "Не вдалося увійти. Спробуйте ще раз.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2 text-center">
          Вхід
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Увійдіть, щоб продовжити роботу над своїми світами
        </p>

        {serverError && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Вхід..." : "Увійти"}
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Немає акаунта?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
