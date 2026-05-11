import React from 'react';
import { User } from 'lucide-react';

function resolveProfileImageUrl(src) {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

export default function Avatar({
  src,
  name = 'User',
  size = 40,
  className = '',
  textClassName = '',
}) {
  const resolvedSrc = resolveProfileImageUrl(src);
  const initial = (name || 'U').trim().slice(0, 1).toUpperCase();

  if (resolvedSrc) {
    return (
      <div
        className={`overflow-hidden rounded-full bg-white ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={resolvedSrc}
          alt={name}
          className="h-full w-full object-contain object-center"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#FF4854] text-white ${className}`}
      style={{ width: size, height: size }}
    >
      <User size={Math.max(16, size * 0.48)} className={textClassName} />
    </div>
  );
}
