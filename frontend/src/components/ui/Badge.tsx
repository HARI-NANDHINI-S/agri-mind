import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral" }) => {
  const styles = {
    success: "bg-green-50 border border-green-200 text-green-700",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-700",
    danger: "bg-red-50 border border-red-200 text-red-700",
    info: "bg-blue-50 border border-blue-200 text-blue-700",
    neutral: "bg-neutral-100 border border-neutral-200 text-neutral-600",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
