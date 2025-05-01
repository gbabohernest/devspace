/**
 * Reusable Date formatter
 */

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Unknown Date";
  }
  return dateFormatter.format(new Date(date));
};

export default formatDate;
