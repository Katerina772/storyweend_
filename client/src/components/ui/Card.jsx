export function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 border border-slate-700 rounded-lg p-5 ${
        onClick ? "cursor-pointer hover:border-slate-600 transition" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`text-slate-300 ${className}`}>{children}</div>;
}
