/**
 * @param text The text to strip the line breaks from
 * @returns {String}
 */
function replaceLbWithBr(text) {
  const replaceLbAfterTag = /<span style="color:#00cc22;">\n\n/g;
  const replaceTwoLbWithBr = /\n\n/g;
  const removeOnlyLb = /\n/g;
  const replaceBrTagsWithSpaces = /<br \/>[ ]+/g;
  const replaceTwoBrTagsWithOne = /<br \/><br \/>/g;
  const addMissingBrBeforeSpan = /(?<!<br \/>)<span style="color:#00cc22;">/g;
  const addAllMissingBrBeforeAsterisk = /(?<!<br \/>)※/g;
  const addMissingBrBeforeAsterisk = /(?<!<br \/><br \/>)※/g;
  const replaceDoubleBrBetweenStar = /(※.+)<br \/><br \/>(※)/g;
  let newText = text.replace(
    replaceLbAfterTag,
    '<span style="color:#00cc22;">'
  );
  newText = newText.replace(replaceTwoLbWithBr, "<br />");
  newText = newText.replace(removeOnlyLb, "");
  newText = newText.replace(replaceBrTagsWithSpaces, "<br />");
  newText = newText.replace(replaceTwoBrTagsWithOne, "<br />");
  newText = newText.replace(
    addMissingBrBeforeSpan,
    '<br /><span style="color:#00cc22;">'
  );
  newText = newText.replace(addAllMissingBrBeforeAsterisk, "<br /><br />※");
  newText = newText.replace(addMissingBrBeforeAsterisk, "<br />※");
  //remove line between double asterix
  const textToReinsert = newText
    .matchAll(replaceDoubleBrBetweenStar)
    .next().value;
  if (!textToReinsert) {
    return newText;
  }
  newText = newText.replace(
    replaceDoubleBrBetweenStar,
    `${textToReinsert[1]}<br />${textToReinsert[2]}`
  );
  return newText;
}

/**
 * Tests if a text ends with a given string.
 * @param {string} textToTest the text to test if it ends with
 * @param {string} endsWith the end we want to find
 */
function endsWith(textToTest, endsWith) {
  const testString = getTestString(endsWith);
  const testRegex = RegExp(`${testString}$`);
  return testRegex.test(textToTest);
}

/**
 * Tests if a text starts with a given string.
 * @param {string} textToTest the text to test if it starts with
 * @param {string} startsWith the end we want to find
 */
function startsWith(textToTest, startsWith) {
  const testString = getTestString(startsWith);
  const testRegex = RegExp(`^${testString}`);
  return testRegex.test(textToTest);
}

function getTestString(searchString) {
  if (searchString === "string") {
    return "\\w";
  } else if (searchString === "number") {
    return "\\d";
  }

  return searchString;
}

function concatDescription(description, textToAdd) {
  let concatingText = "";

  // noinspection CssNegativeValue
  if (
    (endsWith(description, "string") && textToAdd.startsWith("<span")) ||
    (endsWith(description, "string") && startsWith(textToAdd, "string")) ||
    (endsWith(description, "</span>") && startsWith(textToAdd, "string")) ||
    (endsWith(description, "string") && startsWith(textToAdd, "</span>")) ||
    (endsWith(description, '"<span style="color:#[0-9a-fA-F]+;">') &&
      startsWith(textToAdd, "string")) ||
    (description.endsWith(".") && !startsWith(textToAdd, "number")) ||
    description.endsWith(",")
  ) {
    concatingText = " ";
  } else if (
    description !== "" &&
    !endsWith(description, "<br />") &&
    !endsWith(description, "number") &&
    textToAdd.indexOf(".") !== 0 &&
    textToAdd.indexOf(",") !== 0 &&
    textToAdd.indexOf("s") !== 0 &&
    textToAdd.indexOf("%") !== 0 &&
    textToAdd.indexOf("/") !== 0 &&
    textToAdd.indexOf(" or") !== 0 &&
    textToAdd.indexOf("or") !== 0 &&
    !startsWith(textToAdd, "<span")
  ) {
    concatingText = "<br />";
  }

  return `${description}${concatingText}${textToAdd}`;
}

/**
 * parses the JSON description
 * @param {Array} json
 * @param {String} description
 * @param {Object} conditions
 */
function parseJSONDescription(json, description, conditions) {
  json.forEach((element) => {
    if (typeof element === "string") {
      description = replaceLbWithBr(concatDescription(description, element));
    } else if (typeof element === "number") {
      if (endsWith(description, " ")) {
        description += element;
      } else {
        if (description.endsWith(".")) {
          description += `<br />${element}`;
        } else {
          description += ` ${element}`;
        }
      }
    } else if (typeof element === "object") {
      description = parseJSONDescription(
        parseCondition(element, conditions),
        description,
        conditions
      );
    }
  });
  return description;
}

/**
 * parses the JSON description
 * @param {object} condition the condition to test
 * @param {Object} conditions the conditions to be tested for
 */
function parseCondition(condition, conditions) {
  const left = condition["condition"]["left"];
  const operator = condition["condition"]["operator"];
  const right = condition["condition"]["right"];
  const conditionToCheck = `${left} ${operator} ${right}`;
  // eslint-disable-next-line no-unused-vars
  const class_job_id = conditions["class_job_id"];
  // eslint-disable-next-line no-unused-vars
  const class_job_level = conditions["class_job_level"];
  if (eval(conditionToCheck)) {
    return condition["true"];
  } else {
    if (condition["false"] === "") {
      return [""];
    } else if (Array.isArray(condition["false"][0])) {
      return condition["false"][0];
    } else {
      return condition["false"];
    }
  }
}

export { replaceLbWithBr, parseJSONDescription };
