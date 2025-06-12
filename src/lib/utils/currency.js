/**
 * Formats a number as currency according to the specified locale and currency code.
 *
 * @param {number} number - The number to format.
 * @param {string} [locale='en-US'] - The locale to use for formatting (e.g., 'en-US', 'de-DE').
 * @param {string} [currencyCode='USD'] - The currency code to use (e.g., 'USD', 'EUR', 'GBP').
 * @returns {string} The formatted currency string, or an empty string if the input is invalid.
 */
export function formatCurrency(number, locale = 'en-US', currencyCode = 'USD', decimalPoints = 2) {
	try {
		if (typeof number !== 'number') {
			return ''; // Or throw an error, depending on your needs
		}

		const formatter = new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currencyCode,
			minimumFractionDigits: decimalPoints,
			maximumFractionDigits: decimalPoints
		});

		return formatter.format(number);
	} catch (error) {
		console.error('Error formatting currency:', error);
		return ''; // Or throw the error, if you want to handle it higher up
	}
}

/**
 * Parses a currency string into a number.
 *
 * @param {string} currencyString - The currency string to parse.
 * @param {string} [locale='en-US'] - The locale the currency string is formatted in.
 * @param {string} [currencyCode='USD'] - The currency code the string represents.
 * @returns {number|null} The parsed number, or null if the string cannot be parsed.
 */
export function parseCurrency(currencyString, locale = 'en-US', currencyCode = 'USD') {
	try {
		const formatter = new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currencyCode
		});

		// Use a regular expression to extract the numeric part from the string
		const match = currencyString.match(/[-+]?\d*\.?\d+/);

		if (!match) {
			return null; // Or throw an error
		}

		const numberString = match[0];
		const parsedNumber = parseFloat(numberString);

		if (isNaN(parsedNumber)) {
			return null;
		}

		return parsedNumber;
	} catch (error) {
		console.error('Error parsing currency:', error);
		return null;
	}
}
