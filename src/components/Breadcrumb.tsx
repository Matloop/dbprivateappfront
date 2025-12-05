import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Breadcrumb.css';

interface BreadcrumbItemProps {
  label: string;
  path?: string; // Se tiver path, navega. Se não, é o item atual (texto estático)
  action?: () => void; // Ou uma função customizada
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItemProps) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="breadcrumb-wrapper">
      {/* Sempre começa com Home */}
      <span className="breadcrumb-item" onClick={() => navigate('/')}>
        Home
      </span>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="breadcrumb-separator">›</span>
          
          {/* Se não for o último item, é link */}
          {index < items.length - 1 ? (
            <span className="breadcrumb-item" onClick={() => handleClick(item)}>
              {item.label}
            </span>
          ) : (
            /* O último item é o atual (destaque) */
            <span className="breadcrumb-current">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};