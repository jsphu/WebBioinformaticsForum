export const unixRegexToJSRegex = (regex) => {
    // Replace special characters with their JavaScript RegExp equivalents
    return regex
        .replace(/\\\*/g, "\\*") // Escaped asterisk => literal asterisk
        .replace(/\\\./g, "\\.") // Escaped dot => literal dot
        .replace(/\\\$/g, "\\$") // Escaped dollar sign => literal dollar sign
        .replace(/\\\^/g, "\\^") // Escaped caret => literal caret
        .replace(/\*/g, ".*") // Asterisk => matches any character zero or more times
        .replace(/\./g, ".") // Dot => matches any single character
        .replace(/\$/g, "$") // Dollar sign => matches the end of the string
        .replace(/\^/g, "^"); // Caret => matches the start of the string
};
export function dateFormat(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}

export const getId = (nodes) => {
  // find max numeric part of IDs
  let max = 0;
  nodes.forEach((n) => {
    const num = parseInt(n.id.replace(/\D/g, ""), 10); // extract digits
    if (!isNaN(num) && num > max) {
      max = num;
    }
  });
  return String(max + 1);
};
