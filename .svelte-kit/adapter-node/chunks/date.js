function formatDate(date, locale = "en-US", options = {}) {
  try {
    let dateObj;
    if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "";
    }
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const combinedOptions = { ...defaultOptions, ...options };
    const formatter = new Intl.DateTimeFormat(locale, combinedOptions);
    return formatter.format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
function parseDate(dateString) {
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return null;
    }
    return parsedDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}
export {
  formatDate as f,
  parseDate as p
};
