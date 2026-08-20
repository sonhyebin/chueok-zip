import type { ReactNode } from "react";

export default function Window({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`window ${className}`}>
      <div className="window-titlebar">
        <span aria-hidden>▣</span>
        <span className="truncate">{title}</span>
        <span className="win-buttons" aria-hidden>
          <span className="win-btn">–</span>
          <span className="win-btn">□</span>
          <span className="win-btn close">×</span>
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
