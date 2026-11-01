
export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  target,
  rel,
}) {
  const classes = `btn ${
    variant === "outline" ? "btn-outline" : ""
  } ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
