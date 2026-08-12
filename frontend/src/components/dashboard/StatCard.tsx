import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-slate-200/80 dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl ${bgColor} ${color} shadow-sm`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};
