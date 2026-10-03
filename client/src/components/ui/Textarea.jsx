// export function Textarea({
//   label,
//   error,
//   className = "",
//   id,
//   rows = 4,
//   ...props
// }) {
//   const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       {label && (
//         <label htmlFor={textareaId} className="text-sm text-slate-300">
//           {label}
//         </label>
//       )}
//       <textarea
//         id={textareaId}
//         rows={rows}
//         className={`bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 resize-y ${
//           error ? "border-red-500" : ""
//         }`}
//         {...props}
//       />
//       {error && <span className="text-xs text-red-400">{error}</span>}
//     </div>
//   );
// }

import { useId } from "react";

export function Textarea({
  label,
  error,
  className = "",
  id,
  rows = 4,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 resize-y ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
