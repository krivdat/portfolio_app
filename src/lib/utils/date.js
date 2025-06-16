/**
 * Formats a date object or string into a human-readable string.
 *
 * @param {Date | string | number} date - The date to format. Can be a Date object, a date string, or a timestamp.
 * @param {string} [locale='en-US'] - The locale to use for formatting (e.g., 'en-US', 'de-DE').
 * @param {object} [options] - Optional formatting options for Intl.DateTimeFormat.
 * @returns {string} The formatted date string, or an empty string if the date is invalid.
 */
export function formatDate(date, locale = 'en-US', options = {}) {
	try {
		let dateObj;

		if (typeof date === 'string' || typeof date === 'number') {
			dateObj = new Date(date);
		} else if (date instanceof Date) {
			dateObj = date;
		} else {
			return ''; // Invalid date input
		}

		if (isNaN(dateObj.getTime())) {
			return ''; // Invalid date
		}

		const defaultOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		};

		const combinedOptions = { ...defaultOptions, ...options };

		const formatter = new Intl.DateTimeFormat(locale, combinedOptions);
		return formatter.format(dateObj);
	} catch (error) {
		console.error('Error formatting date:', error);
		return '';
	}
}

/**
 * Parses a date string into a Date object.
 *
 * @param {string} dateString - The date string to parse.
 * @returns {Date|null} The parsed Date object, or null if the string cannot be parsed.
 */
export function parseDate(dateString) {
	try {
		const parsedDate = new Date(dateString);

		if (isNaN(parsedDate.getTime())) {
			return null; // Invalid date
		}

		return parsedDate;
	} catch (error) {
		console.error('Error parsing date:', error);
		return null;
	}
}
