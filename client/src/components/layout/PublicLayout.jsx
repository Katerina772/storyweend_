import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-100">
          StoryWeend
        </Link>
        <nav className="flex gap-4">
          <Link
            to="/login"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            Увійти
          </Link>
          <Link
            to="/register"
            className="text-sm text-slate-300 hover:text-slate-100"
          >
            Зареєструватися
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>
    </div>
  );
}
