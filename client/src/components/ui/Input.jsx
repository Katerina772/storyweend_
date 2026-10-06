import { useId } from "react";

export function Input({ label, error, className = "", id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-violet-500 ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
