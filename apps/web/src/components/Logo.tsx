import Image from 'next/image';

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  height?: number;
}

export function Logo({ showWordmark = true, className = '', height = 32 }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo-icon.svg"
        alt="EventForge"
        width={height}
        height={height}
        className="shrink-0"
      />
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-slate-900">
          EventForge
        </span>
      )}
    </div>
  );
}
