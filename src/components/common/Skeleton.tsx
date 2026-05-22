interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'heading' | 'avatar' | 'card' | 'button' | 'custom';
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height,
  count = 1 
}: SkeletonProps) {
  const variantClasses: Record<string, string> = {
    text: 'skeleton skeleton-text',
    heading: 'skeleton skeleton-heading',
    avatar: 'skeleton skeleton-avatar',
    card: 'skeleton skeleton-card',
    button: 'skeleton skeleton-button',
    custom: 'skeleton',
  };

  const baseClass = variantClasses[variant];
  const style: React.CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${baseClass} ${className}`} style={style} />
        ))}
      </div>
    );
  }

  return <div className={`${baseClass} ${className}`} style={style} />;
}

// Predefined skeleton layouts
export function ProfileSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start animate-pulse">
      <div className="skeleton skeleton-avatar" />
      <div className="space-y-6">
        <Skeleton variant="text" count={3} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton variant="card" height="100px" />
          <Skeleton variant="card" height="100px" />
        </div>
        <Skeleton variant="card" height="120px" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[#0B1320]/60 border border-white/10">
      <Skeleton variant="custom" height="180px" className="mb-4 rounded-xl" />
      <Skeleton variant="heading" width="70%" />
      <Skeleton variant="text" count={2} />
      <Skeleton variant="button" className="mt-4" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
      <div className="space-y-8">
        <Skeleton variant="custom" width="200px" height="40px" className="rounded-full" />
        <Skeleton variant="custom" width="100%" height="80px" />
        <Skeleton variant="text" count={2} />
        <div className="flex gap-4">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </div>
      <div className="hidden lg:flex justify-center">
        <Skeleton variant="avatar" className="w-80 h-80" />
      </div>
    </div>
  );
}
