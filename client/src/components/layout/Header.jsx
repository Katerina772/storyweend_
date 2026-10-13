// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth.js";
// import { Button } from "../ui/Button.jsx";

// export function Header() {
//   const { user, isAdmin, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
//       <Link to="/dashboard" className="flex items-center gap-2">
//         <span className="text-xl font-bold text-slate-100">StoryWeend</span>
//       </Link>

//       <div className="flex items-center gap-4">
//         {isAdmin && (
//           <Link
//             to="/admin"
//             className="text-sm text-yellow-400 hover:text-yellow-300"
//           >
//             Адмінпанель
//           </Link>
//         )}

//         <Link
//           to="/profile"
//           className="text-sm text-slate-300 hover:text-slate-100"
//         >
//           {user?.username}
//         </Link>

//         <Button variant="ghost" size="sm" onClick={handleLogout}>
//           Вийти
//         </Button>
//       </div>
//     </header>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../ui/Button.jsx";
import { NotificationBell } from "./NotificationBell.jsx";

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold text-slate-100">StoryWeend</span>
      </Link>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className="text-sm text-yellow-400 hover:text-yellow-300"
          >
            Адмінпанель
          </Link>
        )}

        <NotificationBell />

        <Link
          to="/profile"
          className="text-sm text-slate-300 hover:text-slate-100"
        >
          {user?.username}
        </Link>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Вийти
        </Button>
      </div>
    </header>
  );
}
