import React from 'react';
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base'
};
export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = ''
}: AvatarProps) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return <div className={`
        ${sizes[size]}
        rounded-full overflow-hidden
        bg-background-accent text-primary
        flex items-center justify-center font-medium
        ${className}
      `}>
      {src ? <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" /> : <span>{initials}</span>}
    </div>;
}