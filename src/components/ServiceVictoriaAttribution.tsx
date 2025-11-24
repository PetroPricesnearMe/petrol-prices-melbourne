/**
 * Service Victoria Attribution Component
 * 
 * Displays the required attribution notice for Service Victoria API data
 * as per the Service Victoria Platform Terms (Section 11.5)
 * 
 * Required notice: "© State of Victoria accessed via the Victorian Government Service Victoria Platform"
 */

import Link from 'next/link';

export interface ServiceVictoriaAttributionProps {
  /** Display variant */
  variant?: 'default' | 'compact' | 'inline';
  /** Additional className */
  className?: string;
  /** Show link to Service Victoria */
  showLink?: boolean;
}

export function ServiceVictoriaAttribution({
  variant = 'default',
  className = '',
  showLink = true,
}: ServiceVictoriaAttributionProps) {
  const baseClasses = 'text-sm text-gray-600 dark:text-gray-400';
  
  const variantClasses = {
    default: 'py-2',
    compact: 'py-1 text-xs',
    inline: 'inline',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes}>
      <p>
        © State of Victoria accessed via the{' '}
        {showLink ? (
          <Link
            href="https://www.service.vic.gov.au/find-services/business/fuel-retailers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline dark:text-primary-400 dark:hover:text-primary-300"
            aria-label="Service Victoria Platform (opens in new tab)"
          >
            Victorian Government Service Victoria Platform
          </Link>
        ) : (
          'Victorian Government Service Victoria Platform'
        )}
      </p>
    </div>
  );
}

export default ServiceVictoriaAttribution;

