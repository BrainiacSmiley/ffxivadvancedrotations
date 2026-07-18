/**
 * Helpers for rendering numbers with the FFXIV Lodestone glyph font.
 *
 * That font only covers the private-use block U+E020–E0DB (see styles/fonts.css)
 * and contains no Latin letters — only symbols. To show a number in the FFXIV
 * style we must emit the matching private-use code points; because "FFXIV" is
 * first in the global font stack and its @font-face is scoped to that range,
 * those characters render in the game font while surrounding text is unaffected.
 */

/** Code point of the FFXIV digit "0"; digits 0–9 are contiguous from here. */
const DIGIT_ZERO = 0xe060
/** Code point of the FFXIV "Lv" glyph. */
const LEVEL_GLYPH = String.fromCodePoint(0xe06a)

/** Convert a non-negative integer to its FFXIV glyph-font digit string. */
export function gameNumber(value: number): string {
  const digits = Math.trunc(Math.abs(value)).toString()
  let out = ''
  for (const digit of digits) {
    out += String.fromCodePoint(DIGIT_ZERO + Number(digit))
  }
  return out
}

/** Render a level as the FFXIV "Lv" glyph followed by glyph digits, e.g. Lv90. */
export function gameLevel(level: number): string {
  return `${LEVEL_GLYPH}${gameNumber(level)}`
}
