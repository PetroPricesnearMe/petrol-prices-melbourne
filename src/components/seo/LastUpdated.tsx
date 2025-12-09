/**
 * Last Updated Component
 *
 * Displays "Data last updated: {formattedDate}" text automatically under prices
 * Format: "Data last updated: {formattedDate}"
 *
 * @module components/seo/LastUpdated
 */

interface LastUpdatedProps {
  /**
   * Timestamp of last update (ISO string or Date object)
   * If not provided, uses current date
   */
  lastUpdated?: string | Date;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Text color variant
   */
  variant?: 'default' | 'muted' | 'accent';
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleDateString('en-AU', options);
}

/**
 * Check if date is today
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Last Updated Component
 *
 * Displays formatted "Data last updated: {date}" text
 * Automatically shows "today" if the date is today
 */
export function LastUpdated({
  lastUpdated,
  className = '',
  variant = 'default',
}: LastUpdatedProps) {
  // Parse the date
  const updateDate = lastUpdated ? new Date(lastUpdated) : new Date();

  // Format the date
  const formattedDate = formatDate(updateDate);

  // Determine display text
  const displayText = isToday(updateDate)
    ? `Data last updated today at ${updateDate.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`
    : `Data last updated: ${formattedDate}`;

  // Variant styles
  const variantClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    accent: 'text-primary-600 dark:text-primary-400',
  };

  return (
    <p
      className={`text-sm ${variantClasses[variant]} ${className}`}
      aria-label={`Last updated: ${formattedDate}`}
    >
      {displayText}
    </p>
  );
}

/**
 * Last Updated Badge Component
 *
 * Compact badge-style display for last updated time
 */
export function LastUpdatedBadge({
  lastUpdated,
  className = '',
}: Omit<LastUpdatedProps, 'variant'>) {
  const updateDate = lastUpdated ? new Date(lastUpdated) : new Date();
  const isTodayDate = isToday(updateDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 ${className}`}
      aria-label={`Last updated: ${formatDate(updateDate)}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isTodayDate ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
        aria-hidden="true"
      />
      {isTodayDate ? 'Updated today' : `Updated ${formatDate(updateDate)}`}
    </span>
  );
}
