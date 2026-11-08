export default function CharCounter({ current = 0, max = 0 }) {
  if (!max) return null;
  const isOver = current > max;
  const isNear = current >= max * 0.85;

  return (
    <div
      className={`admin-char-counter ${isOver ? "over-limit" : isNear ? "near-limit" : ""}`}
      style={{
        fontSize: "11px",
        marginTop: "4px",
        textAlign: "right",
        color: isOver ? "var(--admin-danger)" : isNear ? "#d97706" : "var(--admin-text-muted)",
        fontWeight: isOver ? 700 : 500,
      }}
    >
      {current} / {max} characters {isOver && "(Limit exceeded!)"}
    </div>
  );
}
