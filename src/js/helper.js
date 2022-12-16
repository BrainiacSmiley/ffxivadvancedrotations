import { getLocale } from "@/i18n";

/**
 * Capitalize only the first letter of a given string
 * @param {String} string the string to capitalize the first letter
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Capitalize every first letter of a word given in a string
 * @param {String} string the string to capitalize every word
 * @returns {*}
 */
function capitalizeEveryFirstLetter(string) {
  return string.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

/**
 * Formats a number to a configurable numb
 * @param {Number} value The value to format
 * @param {Number} decimalPlaces The number of digits to format to
 * @return {string} The formatted number with given number of digits
 */
function roundNumberToTwoDigits(value, decimalPlaces = 2) {
  const number = Number(
    Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
  );
  const locale = getLocale();
  return number.toLocaleString(locale, {
    minimumFractionDigits: decimalPlaces,
  });
}

/**
 * Formats seconds into [m]m:[s] format
 * @param {Number} secondsToConvert The second to format to
 */
function secondsToMinutes(secondsToConvert) {
  const minutes = Math.floor(secondsToConvert / 60);
  const seconds = ("0" + Math.floor(secondsToConvert % 60)).slice(-2);
  if (seconds === "00") {
    return `${minutes}m`;
  } else {
    return `${minutes}m${seconds}s`;
  }
}

export {
  capitalizeFirstLetter,
  capitalizeEveryFirstLetter,
  roundNumberToTwoDigits,
  secondsToMinutes,
};
