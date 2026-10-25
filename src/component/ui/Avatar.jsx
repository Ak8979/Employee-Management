function Avatar({ name = "User", size = "md", className = "", imageUrl = "" }) {
  const sizes = {
    xs: "h-7 w-7 text-[10px]",
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  const colors = [
    "from-indigo-500 to-violet-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-indigo-600",
  ];

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const colorIndex =
    name
      .trim()
      .toLowerCase()
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      title={name}
      role="img"
      aria-label={`${name}'s avatar`}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br font-bold text-white shadow-sm ${sizes[size] || sizes.md} ${colors[colorIndex]} ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default Avatar;
