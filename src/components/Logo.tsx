import { useState } from 'react';
import { useLogo } from '../hooks/useLogo';

interface LogoProps {
  height?: number;
  className?: string;
  compact?: boolean;
  textOnly?: boolean;
  href?: string;
}

export function Logo({ height = 48, className = '', compact = false, textOnly = false, href }: LogoProps) {
  const { logoUrl } = useLogo();
  const [imgFailed, setImgFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  // Strict validation: Ensures logoUrl is a valid HTTPS string before attempting render
  const validLogo = typeof logoUrl === 'string' && logoUrl.startsWith('https://');
  const showImage = !textOnly && validLogo && !imgFailed;
  
  const inner = showImage ? (
    <ImageLogo 
      src={logoUrl} 
      retry={retry}
      height={height} 
      compact={compact} 
      onFail={() => setImgFailed(true)}
      onRetry={() => setRetry((r) => r + 1)}
    />
  ) : (
    <TextLogo compact={compact} height={height} />
  );

  const base = `inline-flex items-center flex-none ${className}`;

  if (href) {
    return (
      <a href={href} className={base} aria-label="GOWTHAM EDITS — home">
        {inner}
      </a>
    );
  }
  return <span className={base}>{inner}</span>;
}

function ImageLogo({ src, retry, height, compact, onFail, onRetry }: { 
  src: string; 
  retry: number; 
  height: number; 
  compact: boolean; 
  onFail: () => void;
  onRetry: () => void;
}) {
  const handleImageError = () => {
    if (retry < 1) {
      onRetry(); // Trigger one retry
    } else {
      console.error("Logo permanently failed after retry:", src);
      onFail(); // Fallback to text logo
    }
  };

  // Append retry parameter only if it's the second attempt
  const imgSrc = retry ? `${src}${src.includes('?') ? '&' : '?'}retry=${retry}` : src;

  if (compact) {
    return (
      <img 
        src={imgSrc} 
        alt="GOWTHAM EDITS logo" 
        width={height} 
        height={height}
        className="rounded-xl object-contain" 
        style={{ height, width: height }} 
        draggable={false} 
        onError={handleImageError} 
      />
    );
  }

  return (
    <img 
      src={imgSrc} 
      alt="GOWTHAM EDITS" 
      loading="eager"
      decoding="async"
      style={{
        height,
        width: "auto",
        maxWidth: "100%",
        display: "block"
      }}
      className="object-contain" 
      draggable={false} 
      onError={handleImageError} 
    />
  );
}

function TextLogo({ compact, height }: { compact: boolean; height: number }) {
  if (compact) {
    return (
      <span className="grid place-items-center rounded-xl bg-ink-950 font-display font-black text-white"
        style={{ height, width: height, fontSize: height * 0.35 }}>
        G<span className="text-gold-400">E</span>
      </span>
    );
  }
  const size = Math.max(14, Math.round(height * 0.45));
  return (
    <span className="flex flex-col leading-none" style={{ fontSize: size }}>
      <span className="font-display font-extrabold text-white">Gowtham</span>
      <span className="font-display font-extrabold text-gold-400" style={{ fontSize: size * 0.9 }}>edits</span>
    </span>
  );
}
