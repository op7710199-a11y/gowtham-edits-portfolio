import type { LucideIcon } from 'lucide-react';
import {
  Film,
  Heart,
  Sun,
  Bike,
  Smartphone,
  Youtube,
  Palette,
  Sparkles,
  Wand2,
  Users,
  Award,
  Clock,
  CheckCircle,
  MessageCircle,
  Instagram,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import type { IconName } from '../data/content';

export const ICONS: Record<IconName, LucideIcon> = {
  Film,
  Heart,
  Sun,
  Bike,
  Smartphone,
  Youtube,
  Palette,
  Sparkles,
  Wand2,
  Users,
  Award,
  Clock,
  CheckCircle,
  MessageCircle,
  Instagram,
  Send,
  ArrowUpRight,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Film;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
