'use client';

import React from 'react';
import { User } from 'lucide-react';

export default function UserAvatar({
  imageUrl,
  initials,
  alt,
  size = 36,
  className = '',
}: {
  imageUrl?: string;
  initials: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ring-1 ring-outline/20 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full bg-primary/15 text-center text-sm font-bold leading-none text-primary ring-1 ring-primary/20 flex items-center justify-center ${className}`}
    >
      <User className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{initials}</span>
    </div>
  );
}

