/**
 * Locale-aware number formatting, parsing, and precision-safe arithmetic
 * for the NumberInput component.
 */

interface LocaleNumberParts {
  group: string;
  decimal: string;
  minusSign: string;
  plusSign: string;
  affixes: string[];
  digitMap: Map<string, string>;
}

const ASCII_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getLocaleNumberParts(
  locale: string,
  formatOptions?: Intl.NumberFormatOptions,
): LocaleNumberParts {
  const formatter = new Intl.NumberFormat(locale, formatOptions);
  const sampleParts = [
    ...formatter.formatToParts(-1234567.89),
    ...formatter.formatToParts(1234567.89),
  ];

  let group = '';
  let decimal = '.';
  let minusSign = '-';
  let plusSign = '+';
  const affixSet = new Set<string>();

  for (const part of sampleParts) {
    switch (part.type) {
      case 'group':
        group = part.value;
        break;
      case 'decimal':
        decimal = part.value;
        break;
      case 'minusSign':
        minusSign = part.value;
        break;
      case 'plusSign':
        plusSign = part.value;
        break;
      case 'currency':
      case 'percentSign':
      case 'unit':
      case 'literal': {
        const trimmed = part.value.trim();
        if (trimmed) {
          affixSet.add(trimmed);
        }
        break;
      }
      default:
        break;
    }
  }

  // Build localized-digit -> ASCII-digit map (e.g. Arabic-Indic or Devanagari digits)
  const digitFormatter = new Intl.NumberFormat(locale, {
    numberingSystem: formatOptions?.numberingSystem,
    useGrouping: false,
    maximumFractionDigits: 0,
  });
  const digitMap = new Map<string, string>();
  for (let i = 0; i < 10; i++) {
    const localized = digitFormatter.format(i);
    if (localized !== ASCII_DIGITS[i]) {
      digitMap.set(localized, ASCII_DIGITS[i]);
    }
  }

  // Sort longest affixes first so multi-char units/currencies strip cleanly
  const affixes = Array.from(affixSet).sort((a, b) => b.length - a.length);

  return { group, decimal, minusSign, plusSign, affixes, digitMap };
}

/**
 * Formats a numeric value using `Intl.NumberFormat` for the given locale and options.
 * Returns an empty string when `value` is `null` or `NaN`.
 */
export function formatNumber(
  value: number | null,
  locale = 'en-US',
  formatOptions?: Intl.NumberFormatOptions,
): string {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
    return '';
  }
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Parses a locale-formatted number string into a JavaScript `number`, or `null` if invalid/empty.
 *
 * Handles locale grouping/decimal separators, currency/percent/unit affixes,
 * localized digits, minus signs, and whitespace/NBSP/NNBSP characters.
 */
export function parseNumber(
  input: string,
  locale = 'en-US',
  formatOptions?: Intl.NumberFormatOptions,
): number | null {
  let text = input.trim();
  if (!text) return null;

  const { group, decimal, minusSign, plusSign, affixes, digitMap } = getLocaleNumberParts(
    locale,
    formatOptions,
  );

  // Normalize localized digits to ASCII 0-9
  if (digitMap.size > 0) {
    for (const [localized, ascii] of digitMap) {
      text = text.split(localized).join(ascii);
    }
  }

  // Normalize minus/plus signs (including Unicode minus U+2212)
  if (minusSign !== '-') {
    text = text.split(minusSign).join('-');
  }
  text = text.replace(/\u2212/g, '-');
  if (plusSign !== '+') {
    text = text.split(plusSign).join('+');
  }

  // Strip currency, percent, unit, and literal affixes
  for (const affix of affixes) {
    text = text.replace(new RegExp(escapeRegExp(affix), 'g'), '');
  }

  // Strip all whitespace (regular spaces, NBSP \u00A0, NNBSP \u202F, etc.)
  text = text.replace(/[\s\u00A0\u202F]+/g, '');

  // Strip grouping separator if it is not whitespace and not identical to the decimal separator
  if (group && !/^[\s\u00A0\u202F]+$/.test(group) && group !== decimal) {
    text = text.split(group).join('');
  }

  // Normalize decimal separator to '.'
  if (decimal && decimal !== '.') {
    text = text.split(decimal).join('.');
  }

  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text)) {
    return null;
  }

  let parsed = Number(text);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  // Intl.NumberFormat multiplies by 100 for style: 'percent'
  if (formatOptions?.style === 'percent') {
    const precision = getDecimalPlaces(parsed) + 2;
    parsed = Number((parsed / 100).toFixed(Math.min(precision, 20)));
  }

  return Object.is(parsed, -0) ? 0 : parsed;
}

/**
 * Returns the number of decimal places in a finite number, accounting for scientific notation.
 */
export function getDecimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const str = String(value).toLowerCase();
  const [coeff, expStr] = str.split('e');
  const dotIndex = coeff.indexOf('.');
  const fracDigits = dotIndex === -1 ? 0 : coeff.length - dotIndex - 1;
  const exp = expStr ? Number.parseInt(expStr, 10) : 0;
  return Math.max(0, fracDigits - exp);
}

/**
 * Adds `delta` to `value` while avoiding IEEE-754 floating-point drift (e.g. `0.1 + 0.2 === 0.3`).
 */
export function stepNumber(value: number, delta: number): number {
  const precision = Math.max(getDecimalPlaces(value), getDecimalPlaces(delta));
  const result = Number((value + delta).toFixed(Math.min(precision, 20)));
  return Object.is(result, -0) ? 0 : result;
}

/**
 * Clamps a numeric value to optional finite `[min, max]` bounds.
 */
export function clampNumber(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined && Number.isFinite(min) && result < min) {
    result = min;
  }
  if (max !== undefined && Number.isFinite(max) && result > max) {
    result = max;
  }
  return result;
}
