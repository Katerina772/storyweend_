const VARIANTS = {
  // primary: "bg-blue-600 hover:bg-blue-700 text-white",
  primary: "bg-violet-600 hover:bg-violet-700 text-white",
  secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
