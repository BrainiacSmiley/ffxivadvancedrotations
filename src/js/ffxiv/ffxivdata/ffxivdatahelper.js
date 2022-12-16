/**
 * @param text The text to strip the line breaks from
 * @returns {String}
 */
function replaceLbWithBr(text) {
  const replaceTwoLbWithBr = /\n\n/g;
  const removeOnlyLb = /\n/g;
  const replaceBrTagsWithSpaces = /<br \/>[ ]+/g;
  const replaceTwoBrTagsWithOne = /<br \/><br \/>/g;
  const addMissingBrBeforeSpan = /(?<!<br \/>)<span style="color:#00cc22;">/g;
  const addMissingBrBeforeAsterisk = /(?<!<br \/><br \/>)※/g;
  let newText = text.replace(replaceTwoLbWithBr, "<br />");
  newText = newText.replace(removeOnlyLb, "");
  newText = newText.replace(replaceBrTagsWithSpaces, "<br />");
  newText = newText.replace(replaceTwoBrTagsWithOne, "<br />");
  newText = newText.replace(
    addMissingBrBeforeSpan,
    '<br /><span style="color:#00cc22;">'
  );
  newText = newText.replace(addMissingBrBeforeAsterisk, "<br />※");
  return newText;
}

export { replaceLbWithBr };
