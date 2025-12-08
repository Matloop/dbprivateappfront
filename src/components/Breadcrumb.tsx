import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils'; // Utilitário do shadcn que você já tem

interface BreadcrumbItemProps {
  label: string;
  path?: string;
  action?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItemProps) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className={cn(
      "w-full bg-card border-b border-white/10 shadow-md relative z-10",
      "px-[5%] py-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
      className
    )}>
      {/* Item Home */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center hover:text-primary transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-white/20" />
          
          {index < items.length - 1 ? (
            <button 
              onClick={() => handleClick(item)}
              className="hover:text-primary transition-colors duration-200 font-medium capitalize"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-white font-bold truncate max-w-[200px] md:max-w-md capitalize">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};