/**
 * MainLayout Template
 * 
 * Standard page layout with header, content, and footer
 */

import React from 'react';
import { Header, type HeaderProps } from '../../organisms/Header';
import { Footer, type FooterProps } from '../../organisms/Footer';
import type { BaseProps, WithChildren } from '@/types/index';
import { cn } from '@/design-system/utils/styled';
import './MainLayout.css';

export interface MainLayoutProps extends BaseProps, WithChildren {
  /** Header configuration */
  header?: HeaderProps;
  /** Footer configuration */
  footer?: FooterProps;
  /** Maximum content width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Remove padding from content */
  noPadding?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  footer,
  maxWidth = 'xl',
  noPadding = false,
  className,
  style,
  testId,
}) => {
  const classNames = cn('main-layout', className);

  const contentClassNames = cn(
    'main-layout__content',
    `main-layout__content--${maxWidth}`,
    noPadding && 'main-layout__content--no-padding'
  );

  return (
    <div className={classNames} style={style} data-testid={testId}>
      {header && <Header {...header} />}
      
      <main className={contentClassNames} id="main-content">
        {children}
      </main>
      
      {footer && <Footer {...footer} />}
    </div>
  );
};

