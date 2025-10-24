/**
 * Tabs Component - Accessible tabbed interface
 * Supports keyboard navigation and screen readers
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  onTabChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  className = '',
  tabClassName = '',
  contentClassName = '',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (defaultActiveTab && tabs.some(tab => tab.id === defaultActiveTab)) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        const prevTab = tabs[prevIndex];
        if (!prevTab.disabled) {
          setActiveTab(prevTab.id);
          tabRefs.current[prevIndex]?.focus();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (!nextTab.disabled) {
          setActiveTab(nextTab.id);
          tabRefs.current[nextIndex]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = tabs[0];
        if (!firstTab.disabled) {
          setActiveTab(firstTab.id);
          tabRefs.current[0]?.focus();
        }
        break;
      case 'End':
        event.preventDefault();
        const lastTab = tabs[tabs.length - 1];
        if (!lastTab.disabled) {
          setActiveTab(lastTab.id);
          tabRefs.current[tabs.length - 1]?.focus();
        }
        break;
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          'flex border-b border-gray-200 dark:border-gray-700',
          'overflow-x-auto scrollbar-hide',
          tabClassName
        )}
        aria-label="Station information tabs"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            onKeyDown={e => handleKeyDown(e, tab.id, index)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium',
              'border-b-2 border-transparent transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'whitespace-nowrap min-w-0',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className={cn(
          'mt-6 animate-in fade-in-50 duration-200',
          contentClassName
        )}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
