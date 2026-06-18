import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        easy: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        medium: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        hard: 'border-transparent bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
        solved: 'border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        attempted: 'border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
        revised: 'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        mastered: 'border-transparent bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
        notstarted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
