function Alert({ variant = "info", children, className = "", onClose }) {
  const styles = {
    success: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      icon: "✓",
      iconStyle: "bg-emerald-100 text-emerald-700",
      role: "status",
    },
    error: {
      wrapper: "border-red-200 bg-red-50 text-red-800",
      icon: "!",
      iconStyle: "bg-red-100 text-red-700",
      role: "alert",
    },
    warning: {
      wrapper: "border-amber-200 bg-amber-50 text-amber-800",
      icon: "!",
      iconStyle: "bg-amber-100 text-amber-700",
      role: "status",
    },
    info: {
      wrapper: "border-blue-200 bg-blue-50 text-blue-800",
      icon: "i",
      iconStyle: "bg-blue-100 text-blue-700",
      role: "status",
    },
  };

  const current = styles[variant] || styles.info;

  return (
    <div
      role={current.role}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${current.wrapper} ${className}`}>
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${current.iconStyle}`}>
        {current.icon}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">{children}</div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="rounded-md px-1 text-current opacity-70 transition hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
