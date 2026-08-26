import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="font-semibold text-neutral-800 text-base">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
