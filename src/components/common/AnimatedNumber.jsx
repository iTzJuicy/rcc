import { useEffect, useMemo, useState } from "react";
import useReveal from "../../hooks/useReveal";

export default function AnimatedNumber({ value }) {
  const { ref, isVisible } = useReveal();
  const { text, match, prefix, target, suffix } = useMemo(() => {
    const nextText = String(value ?? "0");
    const nextMatch = nextText.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
    return {
      text: nextText,
      match: nextMatch,
      prefix: nextMatch?.[1] || "",
      target: nextMatch ? Number(nextMatch[2]) : 0,
      suffix: nextMatch?.[3] || "",
    };
  }, [value]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible || !match) return undefined;

    const start = performance.now();
    const duration = 750;
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(target * eased);
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, match, target]);

  const display = match
    ? `${prefix}${Number.isInteger(target) ? Math.round(current) : current.toFixed(1)}${suffix}`
    : text;

  return <span ref={ref}>{display}</span>;
}
