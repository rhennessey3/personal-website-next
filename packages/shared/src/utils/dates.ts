import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @param formatStr format string for date-fns
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = 'MMMM d, yyyy'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Returns a relative time string (e.g. "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function timeAgo(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return dateString;
  }
}

/**
 * Checks if a date is in the past
 * @param dateString ISO date string
 * @returns boolean
 */
export function isDatePast(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return date < new Date();
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Formats a date range
 * @param startDateString ISO date string for start date
 * @param endDateString ISO date string for end date (optional)
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDateString: string,
  endDateString?: string,
  formatStr: string = 'MMM yyyy'
): string {
  try {
    const startDate = formatDate(startDateString, formatStr);
    
    if (!endDateString) {
      return `${startDate} - Present`;
    }
    
    const endDate = formatDate(endDateString, formatStr);
    return `${startDate} - ${endDate}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return `${startDateString} - ${endDateString || 'Present'}`;
  }
}