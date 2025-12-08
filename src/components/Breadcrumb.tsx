'use client'; // Obrigatório porque usa hooks de navegação

import React from 'react';
import { useRouter } from 'next/navigation'; // Mudança principal
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const router = useRouter();

  const handleClick = (item: BreadcrumbItemProps) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path); // navigate() vira router.push()
    }
  };

  return (
    <div className={cn(
      "w-full bg-card border-b border-border shadow-sm relative z-10",
      "px-[5%] py-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
      className
    )}>
      {/* Item Home */}
      <button 
        onClick={() => router.push('/')} 
        className="flex items-center hover:text-primary transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          
          {index < items.length - 1 ? (
            <button 
              onClick={() => handleClick(item)}
              className="hover:text-primary transition-colors duration-200 font-medium capitalize"
            >
              {item.label}
            </button>
          ) : (
            /* O último item é o atual (destaque) */
            <span className="text-foreground font-bold truncate max-w-[200px] md:max-w-md capitalize">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};