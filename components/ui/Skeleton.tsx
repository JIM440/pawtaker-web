import React from 'react';

export default function Skeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-outline/20 ${className}`}
      aria-hidden="true"
    />
  );
}

