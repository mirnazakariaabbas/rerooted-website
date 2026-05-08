import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export type ActionTileTone = 'primary' | 'secondary' | 'accent' | 'cream';

const TONE_STYLES: Record<ActionTileTone, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  cream: 'bg-card text-foreground border border-border',
};

interface ActionTileProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  tone?: ActionTileTone;
  trailing?: ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
  as?: 'button' | 'div';
  className?: string;
}

/**
 * Bold colored tile used across the member app.
 * Bold 900 title, small subtitle, icon on the right, optional arrow.
 */
export const ActionTile = ({
  title,
  subtitle,
  icon,
  tone = 'cream',
  trailing,
  onClick,
  showArrow = true,
  as = 'button',
  className = '',
}: ActionTileProps) => {
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-[900] tracking-tight leading-tight">{title}</div>
        {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
      </div>
      {icon && <div className="shrink-0 opacity-90">{icon}</div>}
      {trailing}
      {showArrow && onClick && (
        <ArrowRight className="h-4 w-4 opacity-60 shrink-0" />
      )}
    </>
  );

  const base = `w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-colors ${TONE_STYLES[tone]} ${className}`;

  if (as === 'div' || !onClick) {
    return <div className={base}>{content}</div>;
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={base}
    >
      {content}
    </motion.button>
  );
};

export default ActionTile;
