import React from 'react';

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export const Creato4LabLogoMark: React.FC<LogoMarkProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <img
      src="/creato4-logo.png"
      alt="Creato4 Lab Logo"
      width={size}
      height={size}
      className={`rounded-2xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 object-cover ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};
