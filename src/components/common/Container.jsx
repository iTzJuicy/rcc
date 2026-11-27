
import { createElement } from "react";

export default function Container({
  children,
  className = "",
  as: Component = "div",
}) {
  return createElement(Component, { className: `container ${className}`.trim() }, children);
}
