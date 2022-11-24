function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function capitalizeEveryFirstLetter(string) {
  return string.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

export { capitalizeFirstLetter, capitalizeEveryFirstLetter };
