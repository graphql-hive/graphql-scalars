import { Kind } from 'graphql/language';
import { GraphQLIBAN } from '../src/scalars/IBAN.js';

// List was taken from https://www.iban.com/structure
const IBANs = [
  'AL35 2021 1109 0000 0000 0123 4567',
  'AD1400080001001234567890',
  'AT483200000012345864',
  'AZ96AZEJ00000000001234567890',
  'BH02CITI00001077181611',
  'BY86AKBB10100000002966000000',
  'BE71096123456769',
  'BA393385804800211234',
  'BR1500000000000010932840814P2',
  'BG18RZBB91550123456789',
  'CR23015108410026012345',
  'HR1723600001101234565',
  'CY21002001950000357001234567',
  'CZ5508000000001234567899',
  'DK9520000123456789',
  'DO22ACAU00000000000123456789',
  'SV43 ACAT 0000 0000 0000 0012 3123',
  'EE471000001020145685',
  'FO9264600123456789',
  'FI1410093000123458',
  'FR7630006000011234567890189',
  'GE60NB0000000123456789',
  'DE75512108001245126199',
  'GI04BARC000001234567890',
  'GR9608100010000001234567890',
  'GL8964710123456789',
  'GT20AGRO00000000001234567890',
  'VA59001123000012345678',
  'HU93116000060000000012345676',
  'IS750001121234563108962099',
  'IQ 20 CBIQ 861 8001 0101 0500',
  'IE64IRCE92050112345678',
  'IL170108000000012612345',
  'IT60X0542811101000000123456',
  'JO71CBJO0000000000001234567890',
  'KZ563190000012344567',
  'XK051212012345678906',
  'KW81CBKU0000000000001234560101',
  'LV97HABA0012345678910',
  'LB92000700000000123123456123',
  'LI7408806123456789012',
  'LT601010012345678901',
  'LU120010001234567891',
  'MT31MALT01100000000000000000123',
  'MR1300020001010000123456753',
  'MU43BOMM0101123456789101000MUR',
  'MD21EX000000000001234567',
  'MC5810096180790123456789085',
  'ME25505000012345678951',
  'NL 02 ABNA 0123 4567 89',
  'MK07200002785123453',
  'NO8330001234567',
  'PK36SCBL0000001123456702',
  'PS92PALS000000000400123456702',
  'PL10105000997603123456789123',
  'PT50002700000001234567833',
  'QA54QNBA000000000000693123456',
  'RO09BCYP0000001234567890',
  'LC14BOSL123456789012345678901234',
  'SM76P0854009812123456789123',
  'ST23000200000289355710148',
  'SA4420000001234567891234',
  'RS35105008123123123173',
  'SC52BAHL01031234567890123456USD',
  'SK8975000000000012345671',
  'SI56192001234567892',
  'ES7921000813610123456789',
  'SE7280000810340009783242',
  'CH5604835012345678009',
  'TL380010012345678910106',
  'TN5904018104004942712345',
  'TR320010009999901234567890',
  'UA903052992990004149123456789',
  'AE460090000000123456789',
  'GB33BUKB20201555555555',
  'VG21PACG0000000123456789',
];

describe(`IBAN`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const value of IBANs) {
        expect(GraphQLIBAN.serialize(value)).toEqual(value);
      }
    });

    it(`parseValue`, () => {
      for (const value of IBANs) {
        expect(GraphQLIBAN.parseValue(value)).toEqual(value);
      }
    });

    it(`parseLiteral`, () => {
      for (const value of IBANs) {
        expect(
          GraphQLIBAN.parseLiteral(
            {
              value,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(value);
      }
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid IBAN`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLIBAN.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIBAN.serialize(`this is not an IBAN`)).toThrow(
          /Value is not a valid IBAN/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLIBAN.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIBAN.parseValue(`this is not an IBAN`)).toThrow(/Value is not a valid/);
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLIBAN.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as IBANs but got a/,
        );

        expect(() =>
          GraphQLIBAN.parseLiteral({ value: `this is not an IBAN number`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid IBAN/);
      });
    });
  });
});
