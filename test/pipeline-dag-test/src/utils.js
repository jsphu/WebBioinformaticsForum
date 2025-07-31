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
