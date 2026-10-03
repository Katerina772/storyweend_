import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../../components/ui/Button.jsx";

const FEATURES = [
  {
    icon: "👥",
    title: "Персонажі",
    description:
      "Створюйте картки персонажів з описами, біографіями, ролями та моральними категоріями.",
  },
  {
    icon: "🗺️",
    title: "Локації та карта",
    description:
      "Організовуйте місця світу в ієрархію: країни, міста, села. Розміщуйте їх на інтерактивній карті.",
  },
  {
    icon: "🕸️",
    title: "Зв’язки",
    description:
      "Формуйте граф взаємовідносин: дружба, ворожнеча, спорідненість, суперництво, наставництво.",
  },
  {
    icon: "🛡️",
    title: "Фракції",
    description:
      "Описуйте держави, гільдії, клани. Додавайте учасників, лідерів, території та історію.",
  },
  {
    icon: "📜",
    title: "Хронологія подій",
    description:
      "Будуйте часову шкалу світу. Прив’язуйте події до локацій та персонажів.",
  },
  {
    icon: "📖",
    title: "Лор",
    description:
      "Зберігайте магію, релігію, культуру, технології та традиції у структурованому вигляді.",
  },
];

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  // Якщо вже залогінений — одразу в кабінет
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Навігація */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold">StoryWeend</span>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm text-slate-400 hover:text-slate-100"
            >
              Можливості
            </a>
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-100"
            >
              Увійти
            </Link>
            <Link to="/register">
              <Button size="sm">Зареєструватися</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-500/10 border border-blue-500/30 text-blue-300 mb-6">
          Платформа для проєктування вигаданих світів
        </span>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Створюйте цілісні світи,
          <br />
          <span className="text-blue-400">а не окремі нотатки</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          StoryWeend — це єдиний цифровий простір для авторів книг, ігор,
          коміксів та візуальних новел. Зберігайте персонажів, локації, фракції,
          події та лор в одному структурованому середовищі.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Почати роботу</Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg">
              Дізнатися більше
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Можливості платформи</h2>
          <p className="text-slate-400">
            Усі елементи вигаданого світу — в одному робочому просторі
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Переваги */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Чому саме StoryWeend?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-semibold mb-2">Структурованість</h3>
              <p className="text-sm text-slate-400">
                Замість розкиданих документів — взаємопов’язана модель світу з
                персонажами, локаціями та подіями.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold mb-2">Командна робота</h3>
              <p className="text-sm text-slate-400">
                Запрошуйте редакторів, авторів та художників. Кожен отримує свою
                роль і права доступу.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Приватність</h3>
              <p className="text-sm text-slate-400">
                Проєкти доступні лише власнику та запрошеним. Ідеально для
                роботи над ще не опублікованими творами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Готові створити свій перший світ?
        </h2>
        <p className="text-slate-400 mb-8">
          Реєстрація займає менше хвилини. Почніть безкоштовно.
        </p>
        <Link to="/register">
          <Button size="lg">Зареєструватися</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <span>© 2026 StoryWeend. Дипломний проєкт.</span>
          <span>Розроблено з React, Node.js та PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
}
