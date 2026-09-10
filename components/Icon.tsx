import React from 'react';

interface IconProps {
  /** Material Symbols name, e.g. "church", "play_circle", "campaign". */
  name: string;
  /** Extra Tailwind classes (size via text-[..px], color, etc.). */
  className?: string;
  /** Whether the symbol is filled. Defaults to false (outlined). */
  filled?: boolean;
  /** Accessible label; when omitted the icon is aria-hidden (decorative). */
  label?: string;
}

/**
 * Renders a self-hosted Material Symbols (Outlined) icon.
 *
 * Sizing/color come from Tailwind classes on `className`
 * (e.g. `text-[20px] text-gold-400`). Decorative by default.
 */
export function Icon({ name, className = '', filled = false, label }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: '"FILL" 1' } : undefined}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
