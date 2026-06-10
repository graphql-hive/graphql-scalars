import { GraphQLScalarType, Kind } from 'graphql/index';
import { createGraphQLError } from '../error';

// All ISO 3166-1 alpha-2 codes valid for ISIN, plus common supranationals
const ISIN_COUNTRY_CODES = new Set([
  'AD',
  'AE',
  'AF',
  'AG',
  'AL',
  'AM',
  'AO',
  'AR',
  'AT',
  'AU',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BN',
  'BO',
  'BR',
  'BS',
  'BT',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CL',
  'CM',
  'CN',
  'CO',
  'CR',
  'CU',
  'CV',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EC',
  'EE',
  'EG',
  'ER',
  'ES',
  'ET',
  'FI',
  'FJ',
  'FM',
  'FR',
  'GA',
  'GB',
  'GD',
  'GE',
  'GH',
  'GM',
  'GN',
  'GQ',
  'GR',
  'GT',
  'GW',
  'GY',
  'HN',
  'HR',
  'HT',
  'HU',
  'ID',
  'IE',
  'IL',
  'IN',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JM',
  'JO',
  'JP',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KW',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MR',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NE',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PG',
  'PH',
  'PK',
  'PL',
  'PT',
  'PW',
  'PY',
  'QA',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SI',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SY',
  'SZ',
  'TD',
  'TG',
  'TH',
  'TJ',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TZ',
  'UA',
  'UG',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VN',
  'VU',
  'WS',
  'YE',
  'ZA',
  'ZM',
  'ZW',
  // Supranational / special codes used in practice
  'XS', // Euroclear/Clearstream international
  'EU', // European Union instruments
  'XC',
  'XB',
  'XF',
  'XR',
  'XL',
  'XT',
  'AN',
  'CS',
]);

/**
 * Converts an ISIN string to a pure digit string for Luhn validation.
 * Letters are replaced using their ASCII value minus 55 (A=10, B=11, ... Z=35),
 * matching the ISO 6166 specification.
 *
 * @param isin - Uppercase ISIN string (e.g. "US0378331005")
 * @returns A string of digits ready for Luhn check (e.g. "302803783310 05")
 */
function convertToDigits(isin: string): string {
  return isin
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return (code - 55).toString();
      }
      return char;
    })
    .join('');
}

/**
 * Validates a pure digit string using the Luhn algorithm (ISO/IEC 7812).
 * Digits at even positions from the right are doubled; if the result exceeds 9,
 * 9 is subtracted. The ISIN is valid if the total sum is divisible by 10.
 *
 * @param digits - Expanded digit string produced by convertToDigits()
 * @returns true if the Luhn check passes, false otherwise
 */
function luhnCheck(digits: string): boolean {
  let sum = 0;
  const len = digits.length;

  for (let i = 0; i < len; i++) {
    let digit = parseInt(digits[i], 10);

    // i from left → position from right = (len - 1 - i)
    // double if that position is even (0-based: position 0 is rightmost)
    if ((len - 1 - i) % 2 === 1) {
      digit *= 2;
      // If doubling gives ≥ 10, add the two digits (same as subtracting 9)
      if (digit >= 10) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Validates an ISIN (International Securities Identification Number) string.
 * Checks format (ISO 6166: 2 alpha + 9 alphanumeric + 1 digit),
 * country code against ISO 3166-1 alpha-2 (plus supranationals),
 * and the Luhn check digit.
 *
 * @param isin - Raw ISIN string (normalized to uppercase, strips whitespace and dashes)
 * @returns true if the ISIN is structurally valid, false otherwise
 */
function validate(isin: string): boolean {
  isin = isin.toUpperCase().replace(/[\s-]/g, '');
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) return false;
  if (!ISIN_COUNTRY_CODES.has(isin.slice(0, 2))) return false;
  return luhnCheck(convertToDigits(isin));
}

export const GraphQLISIN = /*#__PURE__*/ new GraphQLScalarType({
  name: `ISIN`,
  description: `A field whose value is an International Securities Identification Number (ISIN): https://en.wikipedia.org/wiki/International_Securities_Identification_Number.`,
  serialize(value: string) {
    if (typeof value !== 'string') {
      throw createGraphQLError(`Value is not string: ${value}`);
    }

    if (!validate(value)) {
      throw createGraphQLError(`Value is not a valid ISIN: ${value}`);
    }

    return value;
  },

  parseValue(value: string) {
    if (typeof value !== 'string') {
      throw createGraphQLError(`Value is not string: ${value}`);
    }

    if (!validate(value)) {
      throw createGraphQLError(`Value is not a valid ISIN: ${value}`);
    }

    return value;
  },

  parseLiteral(ast: { kind: any; value: string }) {
    if (ast.kind !== Kind.STRING) {
      throw createGraphQLError(`Can only validate strings as ISINs but got a: ${ast.kind}`, {
        nodes: ast,
      });
    }

    if (!validate(ast.value)) {
      throw createGraphQLError(`Value is not a valid ISIN: ${ast.value}`);
    }

    return ast.value;
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      type: 'string',
    },
  },
});
